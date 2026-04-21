import React, { useEffect, useState, useContext, useRef } from "react";
import "./Appointment.css";
import GeneralModal from "../generalModal/GeneralModal";
import CancelModal from "./CancelModal";
import ReviewModal from "./ReviewModal";
import AuthContext from "../../Context/Auth";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditAppointment from "./Temp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ListItemIcon, ListItemText } from "@mui/material";
import axios from "axios";
import { 
  X, 
  Plus, 
  Minus, 
  Search, 
  Clock, 
  Users, 
  User,
  Check,
  ChevronDown,
  ChevronUp,
  IndianRupee
} from "lucide-react";


// Global sendWhatsAppMessage function
const sendWhatsAppMessage = async (appointmentData, authTokens, vendorData) => {
  try {
    let values = [];
    if (appointmentData.for_consultation) {
      values = [
        appointmentData.customer_name,
        "Consultation Appointment",
        appointmentData.consultation_remark || "N/A",
        "N/A",
        appointmentData.gst || 18,
        appointmentData.date,
        appointmentData.time_in,
        vendorData?.salon_name || "Salon",
        vendorData?.salon_name || "Team",
      ];
    } else {
      values = [
        appointmentData.customer_name,
        appointmentData.included_services?.map((s) => s.service_name).join(", ") || "Services",
        appointmentData.included_services?.map((s) => s.service_name).join(", ") || "Services",
        appointmentData.final_amount,
        appointmentData.gst || 18,
        appointmentData.date,
        appointmentData.time_in,
        vendorData?.salon_name || "Salon",
        vendorData?.salon_name || "Team",
      ];
    }
    const payload = {
      phone_number: `91${appointmentData.customer_phone}`,
      values: values,
    };
    const response = await axios.post(
      "https://backendapi.trakky.in/salonvendor/send-whatsapp-message/",
      payload,
      {
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      }
    );
    if (response.status === 200) {
      console.log("WhatsApp message sent successfully");
    } else {
      console.error("Failed to send WhatsApp message");
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
};

// Service Selection Drawer Component
const ServiceSelectionDrawer = ({ open, onClose, onSave, appointment, authTokens, initialServices = [], vendorData }) => {
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [staffContributions, setStaffContributions] = useState({});
  const [staffContributionErrors, setStaffContributionErrors] = useState({});
  const [serviceSearch, setServiceSearch] = useState("");
  const [showServiceDropdown, setShowServiceDropdown] = useState({});
  const [showStaffDropdown, setShowStaffDropdown] = useState({});

  useEffect(() => {
    setServices(initialServices && initialServices.length > 0 ? initialServices : [{ 
      id: "", 
      service_name: "", 
      service_time: "", 
      gender: "", 
      discount: "", 
      price: "", 
      from_membership: false, 
      membership_id: 0 
    }]);
  }, [initialServices]);

  useEffect(() => {
    fetchServices();
    fetchStaff();
  }, []);

  const fetchServices = async () => {
    setServiceLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/service/?page=1&salon_id=${vendorData?.salon}`,
        { method: "GET" }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAllServices(data?.results || data || []);
      } else {
        console.error("Failed to fetch services");
        setAllServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
      setAllServices([]);
    } finally {
      setServiceLoading(false);
    }
  };

 const fetchStaff = async () => {
  try {
    const response = await fetch(
      `https://backendapi.trakky.in/salonvendor/staff/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authTokens?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // ✅ Filter: is_permanent true & is_present true
      const filteredStaff = Array.isArray(data)
        ? data.filter(
            staff =>
              staff.is_permanent === true && staff.is_present === true
          )
        : [];

      setStaffList(filteredStaff);
    }
  } catch (error) {
    console.error("Error fetching staff:", error);
  }
};


  const getStaffName = (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    return staff ? staff.staffname : "Unknown Staff";
  };

  const getTotalPercentage = (serviceId) => {
    const contributions = staffContributions[serviceId] || [];
    return contributions.reduce((total, c) => total + (c.percent || 0), 0);
  };

  const validateStaffContributions = (serviceId, contributions) => {
    const total = contributions?.reduce((sum, c) => sum + (c.percent || 0), 0) || 0;
    return total === 100;
  };

  const handleStaffPercentageChange = (serviceId, staffId, value) => {
    setStaffContributions(prev => {
      const updated = { ...prev };
      if (!updated[serviceId]) return prev;
      
      updated[serviceId] = updated[serviceId].map(c => 
        c.staff_id === staffId ? { ...c, percent: value === "" ? "" : Number(value) } : c
      );
      
      const valid = validateStaffContributions(serviceId, updated[serviceId]);
      setStaffContributionErrors(p => ({ ...p, [serviceId]: !valid }));
      return updated;
    });
  };

  const formateTime = (timeObj) => {
    if (!timeObj) return "0 min";
    const { days, hours, minutes } = timeObj;
    const totalMinutes = (days || 0) * 24 * 60 + (hours || 0) * 60 + (minutes || 0);
    return totalMinutes > 0 ? `${totalMinutes} min` : "0 min";
  };

  const handleSave = () => {
    const invalidServices = services.filter(s => 
      s.id && (!staffContributions[s.id] || !validateStaffContributions(s.id, staffContributions[s.id]))
    );

    if (invalidServices.length > 0) {
      toast.error("Please ensure all services have 100% staff contribution");
      return;
    }

    const servicesWithStaff = services.map(service => ({
      ...service,
      staff: staffContributions[service.id]?.map(c => c.staff_id) || [],
      staff_contributions: staffContributions[service.id] || []
    }));

    onSave(servicesWithStaff);
    onClose();
  };

  const filteredServices = allServices.filter(service =>
    service.service_name?.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const toggleServiceDropdown = (index) => {
    setShowServiceDropdown(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleStaffDropdown = (serviceId) => {
    setShowStaffDropdown(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const handleServiceSelect = (service, index) => {
    const temp = [...services];
    temp[index] = {
      ...service,
      service_id: service.id,
      actual_price: service.price,
      final_price: service.price,
      discount: service.price,
      price: service.price,
      from_membership: false,
      membership_id: 0,
      duration: service.service_time
    };
    setServices(temp);
    setShowServiceDropdown(prev => ({ ...prev, [index]: false }));
    setServiceSearch("");
  };

  const handleStaffSelect = (serviceId, staff) => {
    setStaffContributions(prev => {
      const currentContributions = prev[serviceId] || [];
      const isSelected = currentContributions.some(c => c.staff_id === staff.id);
      
      let updatedContributions;
      if (isSelected) {
        updatedContributions = currentContributions.filter(c => c.staff_id !== staff.id);
      } else {
        updatedContributions = [
          ...currentContributions,
          {
            staff_id: staff.id,
            staff_name: staff.staffname,
            staff_role: staff.staff_role || "Unknown",
            percent: currentContributions.length === 0 ? 100 : 0
          }
        ];
      }

      // Auto-adjust percentages
      if (updatedContributions.length === 1) {
        updatedContributions[0].percent = 100;
      } else if (updatedContributions.length > 1) {
        const equalPercentage = Math.floor(100 / updatedContributions.length);
        updatedContributions = updatedContributions.map(c => ({
          ...c,
          percent: equalPercentage
        }));
      }

      const updated = { ...prev, [serviceId]: updatedContributions };
      const valid = validateStaffContributions(serviceId, updatedContributions);
      setStaffContributionErrors(p => ({ ...p, [serviceId]: !valid }));
      return updated;
    });
  };

  const isStaffSelected = (serviceId, staffId) => {
    return staffContributions[serviceId]?.some(c => c.staff_id === staffId) || false;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full  bg-white shadow-2xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#6B4CD1] text-white">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Service Selection</h3>
              <p className="text-sm text-gray-300 mt-1">
                Configure services for {appointment?.customer_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-6">
              {serviceLoading && (
                <div className="text-center py-12">
                  <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-600 mt-3 font-medium">Loading services...</p>
                </div>
              )}
              
              {!serviceLoading && services?.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex gap-4 items-start mb-4">
                    {/* Service Selection */}
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide text-xs">
                        SERVICE {index + 1}
                      </label>
                      
                      {/* Custom Service Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => toggleServiceDropdown(index)}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        >
                          <div className="flex justify-between items-center">
                            <span className={service.service_name ? "text-gray-900 font-medium" : "text-gray-500"}>
                              {service.service_name || "Select a service"}
                            </span>
                            {showServiceDropdown[index] ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                        </button>

                        {showServiceDropdown[index] && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {/* Search Box */}
                            <div className="p-3 border-b border-gray-200">
                              <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                  type="text"
                                  placeholder="Search services..."
                                  value={serviceSearch}
                                  onChange={(e) => setServiceSearch(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                                />
                              </div>
                            </div>

                            {/* Service Options */}
                            <div className="py-1">
                              {filteredServices.map((srv) => (
                                <button
                                  key={srv.id}
                                  onClick={() => handleServiceSelect(srv, index)}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-gray-900 text-sm">{srv.service_name}</p>
                                      <p className="text-xs text-gray-500 mt-1 capitalize">{srv.gender} • {formateTime(srv.service_time)}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                                      <IndianRupee className="w-3 h-3" />
                                      {srv.price}
                                    </div>
                                  </div>
                                </button>
                              ))}
                              
                              {filteredServices.length === 0 && (
                                <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                  No services found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price Display */}
                    <div className="w-32">
                      <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide text-xs">
                        PRICE
                      </label>
                      <div className="relative">
                        <IndianRupee className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="number"
                          value={service?.price || ""}
                          readOnly
                          className="w-full pl-9 pr-3 py-3.5 border border-gray-300 bg-gray-50 text-gray-700 rounded-lg font-medium text-sm"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Add/Remove Buttons */}
                    <div className="flex gap-2 pt-8">
                      {index === services.length - 1 ? (
                        <button
                          onClick={() => setServices([...services, { 
                            id: "", 
                            service_name: "", 
                            service_time: "", 
                            gender: "", 
                            discount: "", 
                            price: "", 
                            from_membership: false, 
                            membership_id: 0 
                          }])}
                          className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-colors duration-200 shadow-sm"
                          title="Add Service"
                        >
                          <Plus className="w-5 h-5 text-white" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const temp = [...services];
                            temp.length === 1 
                              ? temp[index] = { 
                                  id: "", 
                                  service_name: "", 
                                  service_time: "", 
                                  gender: "", 
                                  discount: "", 
                                  price: "", 
                                  from_membership: false, 
                                  membership_id: 0 
                                }
                              : temp.splice(index, 1);
                            setServices(temp);
                          }}
                          className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors duration-200 shadow-sm"
                          title="Remove Service"
                        >
                          <Minus className="w-5 h-5 text-white" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Service Details & Staff Contribution */}
                  {service?.id && (
                    <div className="ml-1 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>Duration: {formateTime(service.service_time)}</span>
                        <span className="mx-2">•</span>
                        <User className="w-4 h-4" />
                        <span className="capitalize">{service.gender}</span>
                      </div>

                      {/* Staff Contribution */}
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-gray-700" />
                          <label className="font-semibold text-gray-800 text-sm">Staff Allocation *</label>
                        </div>
                        
                        {/* Custom Staff Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => toggleStaffDropdown(service.id)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">
                                {staffContributions[service.id]?.length > 0 
                                  ? `${staffContributions[service.id].length} staff selected`
                                  : "Select staff members"
                                }
                              </span>
                              {showStaffDropdown[service.id] ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                          </button>

                          {showStaffDropdown[service.id] && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              <div className="py-2">
                                {staffList.map((staff) => (
                                  <label
                                    key={staff.id}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                                        isStaffSelected(service.id, staff.id)
                                          ? "bg-gray-900 border-gray-900"
                                          : "border-gray-300"
                                      }`}>
                                        {isStaffSelected(service.id, staff.id) && (
                                          <Check className="w-3 h-3 text-white" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900 text-sm">{staff.staffname}</p>
                                        <p className="text-xs text-gray-500">{staff.staff_role || "No Role"}</p>
                                      </div>
                                    </div>
                                    <input
                                      type="checkbox"
                                      checked={isStaffSelected(service.id, staff.id)}
                                      onChange={() => handleStaffSelect(service.id, staff)}
                                      className="hidden"
                                    />
                                  </label>
                                ))}
                                
                                {staffList.length === 0 && (
                                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                    No staff available
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Staff Percentage Allocation */}
                        {staffContributions[service.id]?.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {staffContributions[service.id].map((contribution) => {
                              const single = staffContributions[service.id].length === 1;
                              return (
                                <div key={contribution.staff_id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                  <span className="text-sm font-medium text-gray-800 flex-1">
                                    {getStaffName(contribution.staff_id)}
                                  </span>
                                  {single ? (
                                    <div className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-medium text-gray-700">
                                      100%
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <div className="relative">
                                        <input
                                          type="number"
                                          value={contribution.percent || ""}
                                          onChange={(e) => handleStaffPercentageChange(service.id, contribution.staff_id, e.target.value)}
                                          className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-transparent"
                                          min="0"
                                          max="100"
                                          placeholder="%"
                                        />
                                      </div>
                                      <span className="text-sm text-gray-600 font-medium">%</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            <div className={`flex justify-between items-center pt-2 ${
                              getTotalPercentage(service.id) === 100 ? "text-green-600" : "text-red-600"
                            }`}>
                              <span className="text-sm font-semibold">Total Allocation</span>
                              <span className="text-sm font-bold">
                                {getTotalPercentage(service.id)}%
                                {getTotalPercentage(service.id) !== 100 && (
                                  <span className="ml-2 text-red-500 text-xs">Must total 100%</span>
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{services?.filter(s => s.id).length || 0}</span> Services
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {services?.reduce((sum, s) => sum + (parseFloat(s.discount) || 0), 0).toFixed(2) || "0.00"}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm shadow-sm"
                >
                  Save Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// ReSchedule Modal Component
const ReScheduleModal = ({ appointment, onClose, onSuccess }) => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const [newDate, setNewDate] = useState(appointment?.date || "");
  const [newTime, setNewTime] = useState(appointment?.appointment_start_time?.slice(0, 5) || "");
  const [loading, setLoading] = useState(false);
  const [showServiceDrawer, setShowServiceDrawer] = useState(false);
  const [editedServices, setEditedServices] = useState([]);

  // Safe initialization
  const selectedServices = appointment?.included_services || [];

  useEffect(() => {
    setEditedServices(selectedServices);
  }, [selectedServices]);

  const handleServiceSave = (updatedServices) => {
    setEditedServices(updatedServices);
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      toast.error("Please select new date and time");
      return;
    }

    if (editedServices.length === 0) {
      toast.error("Please add at least one service");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Delete old appointment
      const deleteRes = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments-new/${appointment?.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      
      if (!deleteRes.ok && deleteRes.status !== 204) {
        throw new Error("Old appointment delete failed");
      }
      
      // Step 2: Create new appointment with updated services
      const freshPayload = {
        date: newDate,
        time_in: newTime + ":00",
        customer_phone: appointment.customer_phone,
        customer_name: appointment.customer_name,
        customer_gender: appointment.customer_gender || "Not Specified",
        manager: appointment.manager || null,
        service: editedServices.map(s => s.service_id || s.id),
        staff: [...new Set([
          ...(editedServices.flatMap(s => s.staff || []) || []),
          ...(appointment.included_offers?.flatMap(o => o.staff || []) || [])
        ])],
        included_services: editedServices,
        included_offers: appointment.included_offers || [],
        staff_contributions: editedServices.flatMap(s => 
          (s.staff_contributions || []).map(sc => ({
            ...sc,
            service_id: s.service_id || s.id
          }))
        ),
        package: appointment.package || [],
        included_package_details: appointment.included_package_details || [],
        for_consultation: appointment.for_consultation || false,
        consultation_remark: appointment.consultation_remark || "",
        appointment_status: "not_started",
        actual_amount: calculateTotalAmount(editedServices),
        final_amount: calculateTotalAmount(editedServices),
        amount_paid: 0,
        due_amount: calculateTotalAmount(editedServices),
        is_reviewed: false,
        membership: appointment.membership || [],
      };
      
      const createRes = await axios.post(
        "https://backendapi.trakky.in/salonvendor/appointments-new/",
        freshPayload,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      
      if (createRes.status === 201) {
        const newAppointment = createRes.data;
        await sendWhatsAppMessage({
          customer_name: appointment.customer_name,
          customer_phone: appointment.customer_phone,
          included_services: editedServices,
          final_amount: calculateTotalAmount(editedServices),
          gst: 18,
          date: newDate,
          time_in: newTime,
          for_consultation: appointment.for_consultation || false,
          consultation_remark: appointment.consultation_remark || "",
        }, authTokens, vendorData);
        
        toast.success("Appointment Rescheduled Successfully!");
        onSuccess?.(newAppointment);
        onClose?.();
      }
    } catch (err) {
      console.error(err);
      toast.error("Reschedule failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = (services) => {
    return services.reduce((total, service) => total + (parseFloat(service.final_price) || parseFloat(service.actual_price) || 0), 0);
  };

  return (
    <>
      <div className="p-4 bg-white shadow-lg border-l-4 border-[#6B4CD1] mx-auto">
        {/* Header Section */}
        <div className="text-left mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
            Reschedule Appointment
          </h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Please select your preferred new date and time for the appointment.
          </p>
        </div>

        {/* Current Appointment Details */}
        <div className="mb-8 p-6 mt-5 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#6B4CD1]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Current Appointment Details
            </h4>
            <button
              onClick={() => setShowServiceDrawer(true)}
              className="rounded-md px-4 py-2 bg-[#6B4CD1] text-white text-sm font-medium hover:bg-[#5a3cb0] transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Change Services
            </button>
          </div>
          
          {/* Customer Information */}
          <div className="mb-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-gray-900">{appointment?.customer_name}</p>
                <p className="text-sm text-gray-600">{appointment?.customer_phone}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {appointment?.customer_gender}
              </span>
            </div>
          </div>

          {/* Selected Service's */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Selected Service's ({editedServices?.length || 0})
              </h5>
              <span className="text-sm font-semibold text-[#6B4CD1]">
                Total: ₹{calculateTotalAmount(editedServices).toLocaleString()}
              </span>
            </div>
            
            {/* Safe mapping with optional chaining */}
            {editedServices?.map((service, index) => (
              <div key={index} className="flex justify-between items-center py-3 px-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">
                    {service?.service_name}
                  </p>
                  {service?.duration?.minutes && (
                    <p className="text-xs text-gray-500 mt-1">
                      Duration: {service.duration.minutes} minutes
                    </p>
                  )}
                  {service?.staff_contributions?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Staff: {service.staff_contributions.map(sc => sc.staff_name).join(", ")}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">
                    ₹{service?.final_price?.toLocaleString() || service?.actual_price?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            {(!editedServices || editedServices.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2">No services selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Reschedule Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
              New Date
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="rounded-md w-full px-4 py-3 border border-gray-400 focus:border-[#6B4CD1] focus:outline-none focus:shadow-sm transition-all duration-200"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
              New Time
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className=" rounded-md w-full px-4 py-3 border border-gray-400 focus:border-[#6B4CD1] focus:outline-none focus:shadow-sm transition-all duration-200"
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-gray-300">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md px-8 py-3 text-gray-700 hover:text-gray-900 font-semibold border border-gray-400 hover:border-gray-600 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReschedule}
            disabled={loading || !newDate || !newTime || editedServices.length === 0}
            className="rounded-md px-8 py-3 bg-[#6B4CD1] text-white font-semibold hover:bg-[#5a3cb0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                Processing Request...
              </>
            ) : (
              "Confirm Reschedule"
            )}
          </button>
        </div>
      </div>

      {/* Service Selection Drawer */}
      {showServiceDrawer && (
        <ServiceSelectionDrawer
          vendorData={vendorData}
          open={showServiceDrawer}
          onClose={() => setShowServiceDrawer(false)}
          onSave={handleServiceSave}
          appointment={appointment}
          authTokens={authTokens}
          initialServices={editedServices}
        />
      )}
    </>
  );
};

const WhatsAppIcon = ({ phoneNumber, message = "Hello" }) => {
  const handleWhatsAppClick = () => {
    if (!phoneNumber) {
      toast.error("No phone number available");
      return;
    }
    const formattedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${formattedMessage}`;
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={handleWhatsAppClick}
      className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-green-600 transition-all shadow-sm hover:shadow-md"
      title="Contact via WhatsApp"
    >
      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.464"/>
      </svg>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const config = {
      running: { label: "IN PROGRESS", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      completed: { label: "COMPLETED", bg: "bg-blue-100 text-blue-800 border-blue-200" },
      cancelled: { label: "CANCELLED", bg: "bg-red-100 text-red-800 border-red-200" },
      not_started: { label: "PENDING", bg: "bg-gray-100 text-gray-700 border-gray-400 border-dashed" }
    };
    return config[status] || config.not_started;
  };
  const { label, bg } = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${bg}`}>
      {label}
    </span>
  );
};

const InfoSection = ({ title, value, children, className = "" }) => (
  <div className={`border-b border-gray-400 border-dashed py-3 ${className}`}>
    <div className="flex justify-between items-start">
      <span className="text-sm font-semibold text-gray-700 min-w-28">{title}:</span>
      <div className="text-sm text-gray-800 text-right flex-1 ml-4 font-medium">
        {children || value}
      </div>
    </div>
  </div>
);

// FIXED: EditAppointment component with safe array handling
const SafeEditAppointment = ({ appointment, closeDrawer, setAppointmentData, onRefresh, isEditMode = false }) => {
  // Add safe initialization for all arrays
  const safeAppointment = {
    ...appointment,
    included_services: appointment?.included_services || [],
    included_offers: appointment?.included_offers || [],
    staff_contributions: appointment?.staff_contributions || [],
    package: appointment?.package || [],
    membership: appointment?.membership || [],
    selled_product_details: appointment?.selled_product_details || { product_list: [] }
  };

  return (
    <EditAppointment 
      appointment={safeAppointment}
      closeDrawer={closeDrawer}
      setAppointmentData={setAppointmentData}
      onRefresh={onRefresh}
      isEditMode={isEditMode}
    />
  );
};

const AppointmentListCard = ({ appointment, onRefresh }) => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const [appointmentData, setAppointmentData] = useState(appointment);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // Checkout drawer
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);


  const [isStarting, setIsStarting] = useState(false);   // Start Service ke liye
const [isEnding, setIsEnding]     = useState(false);   // End Service ke liye

const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    console.log("This is Appointment");
    console.log(appointment);
  }, []);

  // Safe initialization for appointment data
  useEffect(() => {
    if (appointment) {
      setAppointmentData({
        ...appointment,
        included_services: appointment.included_services || [],
        included_offers: appointment.included_offers || [],
        staff_contributions: appointment.staff_contributions || [],
        package: appointment.package || [],
        membership: appointment.membership || [],
        selled_product_details: appointment.selled_product_details || { product_list: [] }
      });
    }
  }, [appointment]);

  const isCheckout = appointmentData?.checkout === true;

  const productList = appointmentData?.selled_product_details?.product_list || [];
  const hasProducts = productList.length > 0;

  const serviceAmount = parseFloat(appointmentData?.final_amount || 0);
  const productAmount = appointmentData?.selled_product_details?.final_total ? parseFloat(appointmentData.selled_product_details.final_total) : 0;

  const totalBilled = isCheckout
    ? (parseFloat(appointmentData?.amount_paid || 0) + parseFloat(appointmentData?.due_amount || 0)).toFixed(2)
    : serviceAmount.toFixed(2);

  const amountPaid = parseFloat(appointmentData?.amount_paid || 0).toFixed(2);
  const dueAmount = parseFloat(appointmentData?.due_amount || 0).toFixed(2);

  const paymentLabel = isCheckout
    ? (dueAmount > 0 ? "PARTIAL" : "PAID")
    : "PENDING PAYMENT";

  const paymentBgClass = paymentLabel === "PAID" ? "bg-green-100 text-green-800 border-green-200" :
    paymentLabel === "PARTIAL" ? "bg-amber-100 text-amber-800 border-amber-200" :
    "bg-orange-100 text-orange-800 border-orange-200";

  const getBorderColor = () => {
    switch (appointmentData?.appointment_status) {
      case "running": return "border-l-emerald-500";
      case "completed": return "border-l-blue-500";
      case "cancelled": return "border-l-red-500";
      default: return "border-l-gray-400";
    }
  };

const handleStartTimer = async () => {
  setIsStarting(true);   // ← Loader shuru

  let currentTime = new Date().toTimeString().slice(0, 8);

  try {
    const res = await fetch(
      `https://backendapi.trakky.in/salonvendor/appointments-new/${appointmentData?.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify({
          time_in: currentTime,
          appointment_status: "running",
        }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      setAppointmentData(data);
      toast.success("Service started successfully");
    } else {
      toast.error("Failed to start service");
    }
  } catch (err) {
    console.error("Start service error:", err);
    toast.error("Network error while starting service");
  } finally {
    setIsStarting(false);   // ← Hamesha loader band
  }
};


const handleEndTimer = async () => {
  setIsEnding(true);   // ← Loader shuru

  try {
    const res = await fetch(
      `https://backendapi.trakky.in/salonvendor/appointments-new/${appointmentData?.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify({
          appointment_end_time: new Date().toTimeString().slice(0, 8),
          appointment_status: "completed",
        }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      setAppointmentData(data);
      toast.success("Service ended successfully");
      setDrawerOpen(true); // checkout khul jayega
    } else {
      toast.error("Failed to end service");
    }
  } catch (err) {
    console.error("End service error:", err);
    toast.error("Network error while ending service");
  } finally {
    setIsEnding(false);   // ← Hamesha loader band
  }
};


  const toggleDrawer = (open) => (event) => {
    if (event?.type === "keydown" && (event?.key === "Tab" || event?.key === "Shift")) return;
    setDrawerOpen(open);
  };

  const toggleEditDrawer = (open) => (event) => {
    if (event?.type === "keydown" && (event?.key === "Tab" || event?.key === "Shift")) return;
    setEditDrawerOpen(open);
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDeleteClick = () => {
    handleClose();
    setShowDeleteConfirm(true);
  };

  const handleRescheduleClick = () => {
    setShowRescheduleModal(true);
  };

 const handleConfirmDelete = async () => {
  setIsDeleting(true);   // Loader shuru

  try {
    const res = await fetch(
      `https://backendapi.trakky.in/salonvendor/appointments-new/${appointmentData?.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify({ is_delete: true }),
      }
    );

    if (res.ok) {
      toast.success("Appointment deleted successfully");
      setShowCard(false);
      onRefresh?.();
    } else {
      const errorData = await res.json().catch(() => ({}));
      toast.error(errorData?.detail || "Failed to delete appointment");
    }
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Network error while deleting appointment");
  } finally {
    setIsDeleting(false);          // Loader band (success ya fail dono mein)
    setShowDeleteConfirm(false);   // Modal band
  }
};

  const handleRescheduleSuccess = (updatedData) => {
    setAppointmentData(updatedData);
    onRefresh?.();
  };

  // Function to render staff contributions
  const renderStaffContributions = () => {
    if (!appointmentData?.staff_contributions || appointmentData.staff_contributions.length === 0) {
      return null;
    }

    return (
      <div className="py-2 border-b border-gray-400 border-dashed">
        <p className="text-xs font-medium text-gray-500 mb-2">Staff Assignment</p>
        <div className="space-y-3">
          {appointmentData.staff_contributions.map((contribution, index) => (
            <div key={index} className="  rounded-lg">
            
              
              {/* Staff Members */}
              <div className="space-y-2">
                {contribution.staff_distribution && contribution.staff_distribution.length > 0 ? (
                  contribution.staff_distribution.map((staff, staffIndex) => (
                    <div
  key={staffIndex}
  className="flex items-center justify-between w-full"
>
  <div className="flex items-center gap-2">
    <p className="text-sm font-medium text-gray-900 truncate">
      {staff?.staff_name || "Unknown Staff"}
      <span className="ml-1 text-gray-500 font-normal">
        ({staff?.staff_role || "N/A"})
      </span>
    </p>
  </div>
</div>

                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No staff assigned</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {showCard && (
        <>
          <div
            className={`bg-white rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 
            border border-gray-200 ${getBorderColor()} border-l-4 overflow-hidden w-full 
            max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl`}
            style={{
              minHeight: "530px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div className="px-5 pt-4 pb-3 border-b border-gray-400 border-dashed">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                  <h3 className="text-base font-bold text-gray-900">#{appointmentData?.id}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={appointmentData?.appointment_status} />
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${paymentBgClass}`}>
                    {paymentLabel}
                  </span>
                  <IconButton size="small" onClick={handleClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <MenuItem onClick={handleDeleteClick}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Delete Appointment</ListItemText>
                    </MenuItem>
                  </Menu>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    {appointmentData?.date
                      ? appointmentData.date.split("-").reverse().join("-")
                      : ""}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{appointmentData?.customer_name}</p>
                  <p className="text-xs text-gray-600">{appointmentData?.customer_phone}</p>
                </div>
                <WhatsAppIcon
                  phoneNumber={appointmentData?.customer_phone}
                  message={`Hello ${appointmentData?.customer_name}, your appointment is confirmed for ${appointmentData?.date}. We look forward to seeing you!`}
                />
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-3 flex-1 space-y-1 text-sm">
              <InfoSection
                title="Services"
                value={appointmentData?.included_services
                  ?.map((s) => s.service_name)
                  .join(", ") ?? "No services"}
              />

              {/* Staff Contributions Section */}
              {renderStaffContributions()}

              {hasProducts && (
                <InfoSection title="Products Sold">
                  <div className="-mx-4 px-4 space-y-2">
                    {productList.map((p, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{p.qauntity} × {p.product_name} {p.product_brand ? `(${p.product_brand})` : ""}</span>
                        <span>₹{p.net_sub_total}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-sm">
                      <span>Products Total</span>
                      <span>₹{productAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </InfoSection>
              )}

              <InfoSection
                title="Offers"
                value={appointmentData?.included_offers?.length > 0
                  ? appointmentData.included_offers.map((o) => o.offer_name).join(", ")
                  : "No offers"}
              />

              <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-400 border-dashed">
                <div>
                  <p className="text-xs font-medium text-gray-500">Start Time</p>
                  <p className="font-semibold text-gray-800">
                    {appointmentData?.time_in
                      ? new Date(`1970-01-01T${appointmentData.time_in}`).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          hour12: true 
                        })
                      : "Not Started"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">End Time</p>
                  <p className="font-semibold text-gray-800">{appointmentData?.appointment_end_time ?? "Not Ended"}</p>
                </div>
              </div>

              {/* <InfoSection title="Customer Type" value={appointmentData?.customer_type ?? "-"} /> */}

              <div className="grid grid-cols-2 gap-8 py-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Billed</p>
                  <p className="text-lg font-bold text-gray-900">₹ {totalBilled}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500">Payment Status</p>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${paymentBgClass}`}>
                    {paymentLabel}
                  </span>
                </div>
              </div>

              {isCheckout && (
                <div className="py-2 -mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Mode</span>
                    <span className="font-medium">{appointmentData?.payment_mode || "Not Selected"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Paid Amount</span>
                    <span className="font-medium text-green-600">₹ {amountPaid}</span>
                  </div>
                  {dueAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Due Amount</span>
                      <span className="font-medium text-red-600">₹ {dueAmount}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-400 border-dashed space-y-2">
              {appointmentData?.is_reviewed && appointmentData.appointment_status === "completed" ? (
                <div className="space-y-2">
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg text-sm transition">
                    Thank You..
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="bg-gray-300 text-gray-500 font-medium py-2.5 rounded-lg text-sm cursor-not-allowed"
                      disabled
                    >
                      Edit Appointment
                    </button>
                    <button
                      className="bg-gray-300 text-gray-500 font-medium py-2.5 rounded-lg text-sm cursor-not-allowed"
                      disabled
                    >
                      Reschedule Appointment
                    </button>
                  </div>
                </div>
              ) : appointmentData.appointment_status === "cancelled" ? (
                <div className="space-y-2">
                  <button className="w-full bg-red-600 text-white font-medium py-2.5 rounded-lg text-sm opacity-80 cursor-not-allowed">
                    Cancelled
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="bg-gray-900 hover:bg-black text-white font-medium py-2.5 rounded-lg text-sm transition"
                      onClick={toggleEditDrawer(true)}
                    >
                      Edit Appointment
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
                      onClick={handleRescheduleClick}
                    >
                      Reschedule Appointment
                    </button>
                  </div>
                </div>
              ) : appointmentData.appointment_status === "running" ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                   <button
  className={`
    bg-blue-600 text-white font-medium py-2.5 rounded-lg text-sm transition
    flex items-center justify-center gap-2 min-w-[140px]
    ${isEnding ? "opacity-70 cursor-not-allowed bg-blue-500" : "hover:bg-blue-700"}
  `}
  onClick={handleEndTimer}
  disabled={isEnding}
>
  {isEnding ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Ending...
    </>
  ) : (
    "End Service"
  )}
</button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel Service
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="bg-gray-900 hover:bg-black text-white font-medium py-2.5 rounded-lg text-sm transition"
                      onClick={toggleEditDrawer(true)}
                    >
                      Edit Appointment
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
                      onClick={handleRescheduleClick}
                    >
                      Reschedule Appointment
                    </button>
                  </div>
                </div>
              ) : !appointmentData?.is_reviewed && appointmentData.appointment_status === "completed" && !isCheckout ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
                      onClick={() => setShowReviewModal(true)}
                    >
                      Review
                    </button>
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
                      onClick={() => setDrawerOpen(true)}
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="bg-gray-300 text-gray-500 font-medium py-2.5 rounded-lg text-sm cursor-not-allowed"
                      disabled
                    >
                      Edit Appointment
                    </button>
                    <button
                      className="bg-gray-300 text-gray-500 font-medium py-2.5 rounded-lg text-sm cursor-not-allowed"
                      disabled
                    >
                      Reschedule Appointment
                    </button>
                  </div>
                </div>
              ) : !appointmentData?.is_reviewed && appointmentData.appointment_status === "completed" && isCheckout ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
                      onClick={() => setShowReviewModal(true)}
                    >
                      Review
                    </button>
                    <button className="bg-green-600 text-white font-medium py-2.5 rounded-lg text-sm opacity-80">
                      Thank You
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="bg-gray-300 text-gray-500 font-medium py-2.5 rounded-lg text-sm cursor-not-allowed"
                      disabled
                    >
                      Edit Appointment
                    </button>
                    <button
                      className="bg-gray-300 text-gray-500 font-medium py-2.5 rounded-lg text-sm cursor-not-allowed"
                      disabled
                    >
                      Reschedule Appointment
                    </button>
                  </div>
                </div>
              ) : (
                appointmentData.appointment_status === "not_started" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
<button
  className={`
    bg-emerald-600 text-white font-medium py-2.5 rounded-lg text-sm transition
    flex items-center justify-center gap-2 min-w-[140px]
    ${isStarting ? "opacity-70 cursor-not-allowed bg-emerald-600" : "hover:bg-emerald-800"}
  `}
  onClick={handleStartTimer}
  disabled={isStarting}
>
  {isStarting ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Starting...
    </>
  ) : (
    "Start Service"
  )}
</button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
                        onClick={() => setShowCancelModal(true)}
                      >
                        Cancel Service
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="bg-gray-900 hover:bg-black text-white font-medium py-2.5 rounded-lg text-sm transition"
                        onClick={toggleEditDrawer(true)}
                      >
                        Edit Appointment
                      </button>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
                        onClick={handleRescheduleClick}
                      >
                        Reschedule Appointment
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Checkout Drawer - FIXED: Using SafeEditAppointment */}
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box style={{ width: "fit-content" }} role="presentation">
              <SafeEditAppointment
                appointment={appointmentData}
                closeDrawer={() => setDrawerOpen(false)}
                setAppointmentData={setAppointmentData}
                onRefresh={onRefresh}
              />
            </Box>
          </Drawer>

          {/* Edit Drawer - FIXED: Using SafeEditAppointment */}
          <Drawer anchor="right" open={editDrawerOpen} onClose={toggleEditDrawer(false)}>
            <Box style={{ width: "fit-content" }} role="presentation">
              <SafeEditAppointment
                appointment={appointmentData}
                closeDrawer={() => setEditDrawerOpen(false)}
                setAppointmentData={setAppointmentData}
                isEditMode={true}
              />
            </Box>
          </Drawer>
        </>
      )}

      {/* ReSchedule Modal */}
      <GeneralModal open={showRescheduleModal} handleClose={() => setShowRescheduleModal(false)}>
        <ReScheduleModal
          appointment={appointmentData}
          onClose={() => setShowRescheduleModal(false)}
          onSuccess={handleRescheduleSuccess}
        />
      </GeneralModal>

      <GeneralModal open={showCancelModal} handleClose={() => setShowCancelModal(false)}>
        <CancelModal
          id={appointmentData?.id}
          customer={appointmentData?.customer_name}
          setShowCancelModal={setShowCancelModal}
          setAppointmentData={setAppointmentData}
        />
      </GeneralModal>

      <GeneralModal open={showReviewModal} handleClose={() => setShowReviewModal(false)}>
        <ReviewModal
          id={appointmentData?.id}
          customer={appointmentData?.customer_name}
          setShowReviewModal={setShowReviewModal}
        />
      </GeneralModal>

     <GeneralModal open={showDeleteConfirm} handleClose={() => setShowDeleteConfirm(false)}>
  <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200 text-center">
    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Confirm Deletion
    </h3>
    <p className="text-gray-600 mb-8 leading-relaxed">
      Are you sure you want to delete appointment
      <span className="font-semibold text-gray-800"> #{appointmentData?.id}</span>?
      <br />
      This action cannot be undone.
    </p>
    <div className="flex justify-center gap-4">
      {/* Cancel Button */}
      <button
        onClick={() => setShowDeleteConfirm(false)}
        disabled={isDeleting}
        className={`
          px-6 py-2.5 rounded-lg border border-gray-300 
          text-gray-700 hover:bg-gray-100 transition-all
          ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        Cancel
      </button>

      {/* Delete Button with Loader */}
      <button
        onClick={handleConfirmDelete}
        disabled={isDeleting}
        className={`
          px-6 py-2.5 min-w-[110px] rounded-lg font-medium transition-all
          flex items-center justify-center gap-2
          ${isDeleting 
            ? "bg-red-400 cursor-not-allowed opacity-80" 
            : "bg-red-600 hover:bg-red-700"}
          text-white
        `}
      >
        {isDeleting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Deleting...
          </>
        ) : (
          "Delete"
        )}
      </button>
    </div>
  </div>
</GeneralModal>
    </>
  );
};

export default AppointmentListCard;