import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { 
  Edit, 
  Plus, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Briefcase,
  Calendar,
  Hash,
  Loader,
  Menu,
  ChevronDown,
  ChevronUp
} from "lucide-react";

function DailySheet({ date }) {
  const { authTokens } = useContext(AuthContext);
  const [staffData, setStaffData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formatisedData, setFormatisedData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const StaffDataGet = async () => {
    try {
      setLoading(true);

      if (!navigator.onLine) {
        toast.error("No Internet Connection");
        return;
      }

      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/staff/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const permanentStaff = data.filter(
          item => item.is_permanent === true
        );
        setStaffData(permanentStaff);
      } else {
        console.error("Failed to fetch staff:", response.status);
      }
    } catch (err) {
      if (!navigator.onLine) {
        toast.error("No Internet Connection");
        return;
      }
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const getStaffAttendanceData = async () => {
    try {
      setLoading(true);

      if (!navigator.onLine) {
        toast.error("No Internet Connection");
        return;
      }

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/staff/attendance/?date=${date}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
      } else {
        console.error("Failed to fetch attendance:", response.status);
        toast.error("Something went wrong. Please try again");
      }
    } catch (err) {
      if (!navigator.onLine) {
        toast.error("No Internet Connection");
        return;
      }
      console.error("Error fetching attendance:", err);
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    StaffDataGet();
    getStaffAttendanceData();
  }, [authTokens, date]);

  useEffect(() => {
    if (staffData?.length > 0) {
      const formatiseD = staffData.map((staff) => {
        const staffAttendance = attendanceData?.find(
          (attendance) => attendance.staff === staff.id
        );
        if (staffAttendance) {
          return {
            id: staff.id,
            staffname: staff.staffname,
            staff_role: staff.staff_role,
            present: staffAttendance.present,
            num_services: staffAttendance.num_services,
            time_in: staffAttendance.time_in,
            time_out: staffAttendance.time_out,
            attendance_id: staffAttendance.id,
            notes: staffAttendance.note ? JSON.parse(staffAttendance.note) : [],
          };
        } else {
          return {
            id: staff.id,
            staffname: staff.staffname,
            staff_role: staff.staff_role,
            present: false,
            num_services: 0,
            time_in: null,
            time_out: null,
            attendance_id: null,
            notes: [],
          };
        }
      });
      setFormatisedData(formatiseD);
    } else {
      setLoading(false);
    }
  }, [attendanceData, staffData]);

  const [editActive, setEditOpen] = useState(false);
  const [PresentEdit, setEditPresent] = useState(false);
  const [editTimeIn, setEditTimeIn] = useState("");
  const [editTimeOut, setEditTimeOut] = useState("");
  const [editAttendanceId, setEditAttendanceId] = useState(null);
  const [editStaffData, setEditStaffData] = useState(null);

  // Note related states
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [currentNoteStaff, setCurrentNoteStaff] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("");

  // Time selection states
  const [timeSelectionOpen, setTimeSelectionOpen] = useState(false);
  const [currentTimeStaff, setCurrentTimeStaff] = useState(null);
  const [currentTimeType, setCurrentTimeType] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const handleEditClose = () => {
    setEditOpen(false);
    setEditPresent(null);
    setEditTimeIn("");
    setEditTimeOut("");
    setEditAttendanceId(null);
    setEditStaffData(null);
  };

  const handleTimeUpdate = async (staffId, type, timeValue) => {
    if (!timeValue) {
      toast.error("Please select a valid time");
      return;
    }

    setUpdating(true);
    const staff = formatisedData.find((item) => item.id === staffId);
    if (!staff) {
      toast.error("Staff not found");
      setUpdating(false);
      return;
    }

    const isPresent = true;
    const payload = {
      present: isPresent,
      time_in: type === "in" ? timeValue : staff.time_in,
      time_out: type === "out" ? timeValue : staff.time_out,
      date: date,
      staff: staffId,
    };

    try {
      let resp = await fetch(
        `https://backendapi.trakky.in/salonvendor/staff/attendance/${staff.attendance_id ? staff.attendance_id + "/" : ""}`,
        {
          method: staff.attendance_id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      let data = await resp.json();

      if (resp.ok) {
        toast.success(`Time ${type} updated successfully`);
        getStaffAttendanceData();
        setTimeSelectionOpen(false);
        setSelectedTime("");
      } else {
        if (data.non_field_errors) {
          toast.error(data.non_field_errors.join(" "));
        } else {
          toast.error("You can only update today's attendance.");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update time");
    } finally {
      setUpdating(false);
    }
  };

  const handleStaffAttendence = async () => {
    let errors = [];

    if (PresentEdit && !editTimeIn) {
      errors.push("Time in is required");
    }

    if (editTimeOut && !editTimeIn) {
      errors.push("Time in is required");
    }

    if (!PresentEdit && (editTimeIn || editTimeOut)) {
      errors.push("Time in and time out must be empty for absent staff");
    }

    if (errors.length > 0) {
      toast.error(errors.join(" "));
      return;
    }

    setUpdating(true);
    let payload = {};

    if (PresentEdit) {
      payload = {
        present: PresentEdit,
        time_in: editTimeIn || null,
        time_out: editTimeOut || null,
        date: date,
        staff: editStaffData?.id,
      };
    } else {
      payload = {
        present: PresentEdit,
        time_in: null,
        time_out: null,
        date: date,
        staff: editStaffData?.id,
      };
    }

    try {
      let resp = await fetch(
        `https://backendapi.trakky.in/salonvendor/staff/attendance/${editAttendanceId ? editAttendanceId + "/" : ""}`,
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
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenNoteModal = (staffId, type) => {
    setCurrentNoteStaff(staffId);
    setNoteType(type);  
    setNoteModalOpen(true); 
  };

  const handleCloseNoteModal = () => {
    setNoteModalOpen(false);
    setNewNote("");
    setCurrentNoteStaff(null);
    setNoteType("");
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("Note cannot Be Empty");
      return;
    }

    setUpdating(true);
    const staff = formatisedData.find((item) => item.id === currentNoteStaff);
    if (!staff) {
      toast.error("Staff not found");
      setUpdating(false);
      return;
    }

    const currentNotes = staff.notes || [];
    const newNoteObj = {
      text: newNote,
      type: noteType,
      createdAt: new Date().toISOString(),
      addedBy: "Admin",
    };

    const updatedNotes = [...currentNotes, newNoteObj];

      let branchId = localStorage.getItem("branchId") || "";

    try {
      let resp = await fetch(
        `https://backendapi.trakky.in/salonvendor/staff/attendance/${staff.attendance_id ? staff.attendance_id + "/" : ""}`,
        {
          method: staff.attendance_id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            note: JSON.stringify(updatedNotes),
            present: staff.present,
            time_in: staff.time_in,
            time_out: staff.time_out,
            date: date,
            staff: currentNoteStaff,
            // branchId : branchId
          }),
        }
      );

      if (resp.ok) {
        toast.success("Note added successfully");
        getStaffAttendanceData();
        handleCloseNoteModal();
      } else {
        toast.error("Failed to add note");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to add note");
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenTimeSelection = (staffId, type, currentTime) => {
    setCurrentTimeStaff(staffId);
    setCurrentTimeType(type);
    setSelectedTime(currentTime || "");
    setTimeSelectionOpen(true);
  };

  const handleCloseTimeSelection = () => {
    setTimeSelectionOpen(false);
    setSelectedTime("");
    setCurrentTimeStaff(null);
    setCurrentTimeType(null);
  };

  const handleSaveTime = () => {
    if (!selectedTime) {
      toast.error("Please select a time");
      return;
    }
    handleTimeUpdate(currentTimeStaff, currentTimeType, selectedTime);
  };

  const formatTimeDisplay = (time) => {
    if (!time) return "Not Set";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Mobile responsive card view
  const SmallDeviceCardView = ({ item, index }) => {
    const isExpanded = expandedRow === item.id;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-3 overflow-hidden">
        <div className="p-4">
          {/* Header Row */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                <span className="text-sm font-medium text-gray-900">{index + 1}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{item.staffname}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  {item.staff_role}
                </span>
              </div>
            </div>
            <button
              onClick={() => setExpandedRow(isExpanded ? null : item.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <div className="text-xs text-gray-500">Services</div>
              <div className="text-base font-semibold text-gray-900">{item.num_services}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Time In</div>
              <div className="text-xs font-medium text-gray-900">
                {item.time_in ? formatTimeDisplay(item.time_in) : "-"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Time Out</div>
              <div className="text-xs font-medium text-gray-900">
                {item.time_out ? formatTimeDisplay(item.time_out) : "-"}
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              {/* Time In Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Time In</span>
                  </span>
                  {item.time_in ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenNoteModal(item.id, "in")}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Add note"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      {item.notes?.some((note) => note.type === "in") && (
                        <button
                          onClick={() => handleOpenNoteModal(item.id, "in")}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="View notes"
                        >
                          <FileText className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
                {item.time_in ? (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-900">{formatTimeDisplay(item.time_in)}</span>
                    <button
                      onClick={() => handleOpenTimeSelection(item.id, "in", item.time_in)}
                      className="px-2 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenTimeSelection(item.id, "in", item.time_in)}
                    className="w-full px-3 py-2 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center space-x-2"
                  >
                    <Clock className="w-3 h-3" />
                    <span>Set Time In</span>
                  </button>
                )}
              </div>

              {/* Time Out Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Time Out</span>
                  </span>
                  {item.time_out ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenNoteModal(item.id, "out")}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Add note"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      {item.notes?.some((note) => note.type === "out") && (
                        <button
                          onClick={() => handleOpenNoteModal(item.id, "out")}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="View notes"
                        >
                          <FileText className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
                {item.time_out ? (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-900">{formatTimeDisplay(item.time_out)}</span>
                    <button
                      onClick={() => handleOpenTimeSelection(item.id, "out", item.time_out)}
                      className="px-2 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenTimeSelection(item.id, "out", item.time_out)}
                    className="w-full px-3 py-2 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center space-x-2"
                  >
                    <Clock className="w-3 h-3" />
                    <span>Set Time Out</span>
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setEditOpen(true);
                    setEditPresent(item.present);
                    setEditTimeIn(item.time_in || "");
                    setEditTimeOut(item.time_out || "");
                    setEditAttendanceId(item.attendance_id);
                    setEditStaffData(item);
                  }}
                  className="w-full px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center space-x-2"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit Full Attendance</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <Toaster />
      
      {/* Header - Responsive */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Daily Staff Sheet</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Attendance for {new Date(date).toLocaleDateString()}
        </p>
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Hash className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>#</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Staff Name</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Role</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Hash className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Services</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Time In</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Time Out</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 sm:py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#492DBD]"></div>
                      <div className="text-xs sm:text-sm text-gray-500">Loading staff data...</div>
                    </div>
                  </td>
                </tr>
              ) : formatisedData?.length > 0 ? (
                formatisedData?.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-xs sm:text-sm text-gray-900">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="text-xs sm:text-sm font-medium text-gray-900">{item.staffname}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.staff_role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-semibold">
                        {item.num_services}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {item.time_in ? (
                          <>
                            <span className="text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                              {formatTimeDisplay(item.time_in)}
                            </span>
                            <div className="flex space-x-0.5 sm:space-x-1">
                              <button
                                onClick={() => handleOpenNoteModal(item.id, "in")}
                                className="p-0.5 sm:p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Add note"
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              {item.notes?.some((note) => note.type === "in") && (
                                <button
                                  onClick={() => handleOpenNoteModal(item.id, "in")}
                                  className="p-0.5 sm:p-1 text-blue-500 hover:text-blue-700 transition-colors"
                                  title="View notes"
                                >
                                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              )}
                            </div>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenTimeSelection(item.id, "in", item.time_in)}
                            className="px-2 py-1 sm:px-3 sm:py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors flex items-center space-x-1 sm:space-x-2"
                          >
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="whitespace-nowrap">Set Time</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {item.time_out ? (
                          <>
                            <span className="text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                              {formatTimeDisplay(item.time_out)}
                            </span>
                            <div className="flex space-x-0.5 sm:space-x-1">
                              <button
                                onClick={() => handleOpenNoteModal(item.id, "out")}
                                className="p-0.5 sm:p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Add note"
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              {item.notes?.some((note) => note.type === "out") && (
                                <button
                                  onClick={() => handleOpenNoteModal(item.id, "out")}
                                  className="p-0.5 sm:p-1 text-blue-500 hover:text-blue-700 transition-colors"
                                  title="View notes"
                                >
                                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              )}
                            </div>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenTimeSelection(item.id, "out", item.time_out)}
                            className="px-2 py-1 sm:px-3 sm:py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors flex items-center space-x-1 sm:space-x-2"
                          >
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="whitespace-nowrap">Set Time</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setEditOpen(true);
                          setEditPresent(item.present);
                          setEditTimeIn(item.time_in || "");
                          setEditTimeOut(item.time_out || "");
                          setEditAttendanceId(item.attendance_id);
                          setEditStaffData(item);
                        }}
                        className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit attendance"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 sm:py-8 text-center">
                    <div className="text-xs sm:text-sm text-gray-500">No staff data available</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#492DBD]"></div>
              <div className="text-xs text-gray-500">Loading staff data...</div>
            </div>
          </div>
        ) : formatisedData?.length > 0 ? (
          formatisedData?.map((item, index) => (
            <SmallDeviceCardView key={item.id} item={item} index={index} />
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-xs text-gray-500">No staff data available</div>
          </div>
        )}
      </div>

      {/* Edit Attendance Modal - Responsive */}
      {editActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Edit Attendance</h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Staff Name</label>
                  <input
                    type="text"
                    value={editStaffData?.staffname || ""}
                    readOnly
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Status</label>
                  <select
                    value={PresentEdit}
                    onChange={(e) => {
                      const value = e.target.value === "true";
                      setEditPresent(value);
                      if (!value) {
                        setEditTimeIn("");
                        setEditTimeOut("");
                      }
                    }}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  >
                    <option value={true}>Present</option>
                    <option value={false}>Absent</option>
                  </select>
                </div>
              </div>

              {PresentEdit && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Time In</label>
                    <input
                      type="time"
                      value={editTimeIn}
                      onChange={(e) => setEditTimeIn(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Time Out</label>
                    <input
                      type="time"
                      value={editTimeOut}
                      onChange={(e) => setEditTimeOut(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex space-x-2 sm:space-x-3">
              <button
                onClick={handleEditClose}
                disabled={updating}
                className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStaffAttendence}
                disabled={updating}
                className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-[#492DBD] rounded-lg hover:bg-[#3a2199] transition-colors disabled:opacity-50 flex items-center justify-center space-x-1 sm:space-x-2"
              >
                {updating && <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />}
                <span>{updating ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Selection Modal - Responsive */}
      {timeSelectionOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm mx-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Set {currentTimeType === "in" ? "Time In" : "Time Out"}
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Select Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
              />
              {selectedTime && (
                <p className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-gray-600">
                  Selected: {formatTimeDisplay(selectedTime)}
                </p>
              )}
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex space-x-2 sm:space-x-3">
              <button
                onClick={handleCloseTimeSelection}
                disabled={updating}
                className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTime}
                disabled={updating || !selectedTime}
                className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-[#492DBD] rounded-lg hover:bg-[#3a2199] transition-colors disabled:opacity-50 flex items-center justify-center space-x-1 sm:space-x-2"
              >
                {updating && <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />}
                <span>{updating ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal - Responsive */}
      {noteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Add Note For {noteType === "in" ? "Time In" : "Time Out"}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Note</label>
                <textarea
                  rows="3"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] resize-none"
                  placeholder="Enter your note here..."
                />
              </div>

              <div className="border-t border-gray-200 pt-3 sm:pt-4">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Previous Notes</h4>
                <div className="max-h-24 sm:max-h-32 overflow-y-auto space-y-1 sm:space-y-2">
                  {currentNoteStaff && formatisedData
                    .find((item) => item.id === currentNoteStaff)
                    ?.notes?.filter((note) => note.type === noteType)
                    .map((note, index) => (
                      <div key={index} className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-900">{note.text}</p>
                        <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex space-x-2 sm:space-x-3">
              <button
                onClick={handleCloseNoteModal}
                disabled={updating}
                className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Close
              </button>
              <button
                onClick={handleAddNote}
                disabled={updating || !newNote.trim()}
                className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-[#492DBD] rounded-lg hover:bg-[#3a2199] transition-colors disabled:opacity-50 flex items-center justify-center space-x-1 sm:space-x-2"
              >
                {updating && <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />}
                <span>{updating ? "Adding..." : "Add Note"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailySheet;