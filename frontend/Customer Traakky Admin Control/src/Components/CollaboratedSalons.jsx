import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CalendarMonth,
  FilterList,
  Close,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  WhatsApp,
  Visibility as ViewIcon,
  TrendingUp,
  BusinessCenter,
  LocationOn,
  Schedule,
  Analytics,
  CheckBoxOutlineBlank,
  CheckBox,
  PlaylistAddCheck
} from "@mui/icons-material";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import DateRange from "./DateRange/CustomDateRange";
import { formatDate } from "./DateRange/formatDate";
import AddCollaboratedSalon from "../Components/Forms/AddCollaboratedSalons";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const SectionInfoModal = ({ open, onClose, section }) => {
  const getSectionInfo = (section) => {
    switch (section) {
      case 'red':
        return {
          title: 'Critical Section',
          description: 'Salons in the Critical Attention section are critically underperforming with limited time to meet targets.',
          criteria: [
            'Conversion rate below 99%',
            '21+ days since package start',
            'Urgent action needed to avoid package failure'
          ],
          action: 'Prioritize high-intensity interventions (e.g., dedicated account manager, revised strategy). If no improvement, consider reevaluating the salon\'s fit for the package.'
        };
      case 'orange':
        return {
          title: 'Warning Section',
          description: 'Salons in the Warning Attention section are at risk of missing mid-term conversion goals and require immediate attention.',
          criteria: [
            'Conversion rate below 66%',
            '14+ days since package start',
            'Moderate time remaining to improve'
          ],
          action: 'Escalate support with targeted strategies (e.g., training, promotions). Address specific challenges to boost performance before the next milestone.'
        };
      case 'yellow':
        return {
          title: 'Attention Section',
          description: 'Salons in the Yellow Attention section are in the early stages but falling short of initial conversion targets.',
          criteria: [
            'Conversion rate below 33%',
            '7+ days since package start',
            'Still significant time to improve'
          ],
          action: 'Proactively engage with these salons to identify barriers and provide guidance. Early intervention can help them get back on track before deadlines approach.'
        };
      default:
        return {
          title: 'Section Information',
          description: 'General information about salon sections.',
          criteria: [],
          action: ''
        };
    }
  };

  const info = section ? getSectionInfo(section) : null;

  if (!open || !info) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{info.title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Close />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-4">{info.description}</p>

          <h4 className="font-semibold text-gray-900 mb-3">Criteria for this section:</h4>
          <ul className="space-y-2 mb-4">
            {info.criteria.map((item, index) => (
              <li key={index} className="flex items-start">
                <FiberManualRecordIcon className="w-4 h-4 text-[#502DA6] mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>

          <h4 className="font-semibold text-gray-900 mb-2">Recommended Action:</h4>
          <p className="text-gray-700">{info.action}</p>
        </div>
        
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const SpendDetailsModal = ({ open, onClose, salon }) => {
  if (!open || !salon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-50">
          <div className="flex items-center space-x-2">
            <BusinessCenter className="w-5 h-5 text-[#502DA6]" />
            <h3 className="text-xl font-semibold text-gray-900">
              {salon.salon?.name || 'Salon'} - Campaign Spend Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Close />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3">Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-lg font-semibold text-gray-900">
                  {salon.campaigns?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-lg font-semibold text-[#502DA6]">
                  {salon.total_campaign_spend || '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-700">Campaign Breakdown</h4>
          </div>

          {salon.campaigns?.length > 0 ? (
            <div className="space-y-3">
              {salon.campaigns.map((campaign, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    index % 2 === 0 ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">Campaign Name</p>
                      <p className="font-medium text-gray-900">{campaign.campaign_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Budget Spent</p>
                      <p className="font-medium text-[#502DA6]">{campaign.budget_spent}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No campaign data available for this salon</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EditSalonModal = ({ open, onClose, salon, onSuccess }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Edit Collaborated Salon</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Close />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <AddCollaboratedSalon
            salon={salon}
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

const DateRangeModal = ({ open, onClose, dateState, setDateState, setIsDateFilterOn }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Select Date Range</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Close />
          </button>
        </div>
        
        <div className="p-6">
          <DateRange
            dateState={dateState}
            setDateState={setDateState}
            setIsDateFilterOn={setIsDateFilterOn}
          />
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsDateFilterOn(true);
              onClose();
            }}
            className="px-6 py-2 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

const CollaboratedSalons = () => {
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [collaboratedSalons, setCollaboratedSalons] = useState([]);
  const [filteredCollaboratedSalons, setFilteredCollaboratedSalons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [dateState, setDateState] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [isDateFilterOn, setIsDateFilterOn] = useState(false);
  const [activeColorFilter, setActiveColorFilter] = useState("all");
  const [searchOption, setSearchOption] = useState("name");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSalon, setCurrentSalon] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSalons, setSelectedSalons] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [currentInfoSection, setCurrentInfoSection] = useState(null);
  const [spendModalOpen, setSpendModalOpen] = useState(false);
  const [selectedSalonSpend, setSelectedSalonSpend] = useState(null);

  const colorFilters = [
    { name: "all", label: "All Salons", color: "primary", icon: <BusinessCenter /> },
    { name: "red", label: "Critical", color: "error", icon: <WarningIcon /> },
    { name: "orange", label: "Warning", color: "warning", icon: <TrendingUp /> },
    { name: "yellow", label: "Attention", color: "info", icon: <Schedule /> },
    { name: "white", label: "Normal", color: "success", icon: <Analytics /> }
  ];

  const searchOptions = [
    { value: "name", label: "Salon Name", icon: <BusinessCenter /> },
    { value: "city", label: "City", icon: <LocationOn /> },
    { value: "area", label: "Area", icon: <LocationOn /> }
  ];

  // All the existing logic functions remain exactly the same
  const handleSpendDetailsClick = (salon) => {
    setSelectedSalonSpend(salon);
    setSpendModalOpen(true);
  };

  const handleSpendModalClose = () => {
    setSpendModalOpen(false);
    setSelectedSalonSpend(null);
  };

  const handleInfoClick = (section) => {
    setCurrentInfoSection(section);
    setInfoModalOpen(true);
  };

  const handleInfoClose = () => {
    setInfoModalOpen(false);
    setCurrentInfoSection(null);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedSalons.map((salon) => salon.id);
      setSelectedSalons(newSelected);
      return;
    }
    setSelectedSalons([]);
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selectedSalons.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedSalons, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedSalons.slice(1));
    } else if (selectedIndex === selectedSalons.length - 1) {
      newSelected = newSelected.concat(selectedSalons.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedSalons.slice(0, selectedIndex),
        selectedSalons.slice(selectedIndex + 1)
      );
    }

    setSelectedSalons(newSelected);
  };

  const isSelected = (id) => selectedSalons.indexOf(id) !== -1;

  const clearSelection = () => {
    setSelectedSalons([]);
  };

  const getStatistics = () => {
    const total = filteredCollaboratedSalons.length;
    const totalLeads = filteredCollaboratedSalons.reduce((sum, salon) => sum + salon.no_of_leads, 0);
    const totalConverted = filteredCollaboratedSalons.reduce((sum, salon) => sum + salon.total_converted_leads, 0);
    const avgConversion = total > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : 0;

    const critical = filteredCollaboratedSalons.filter(s => s.salon_position === 'red').length;
    const warning = filteredCollaboratedSalons.filter(s => s.salon_position === 'orange').length;
    const attention = filteredCollaboratedSalons.filter(s => s.salon_position === 'yellow').length;

    return { total, totalLeads, totalConverted, avgConversion, critical, warning, attention };
  };

  const stats = getStatistics();

  const handleEditClick = (salon) => {
    setCurrentSalon(salon);
    setEditModalOpen(true);
  };

  const handleEditSuccess = (updatedSalon) => {
    setCollaboratedSalons(prev =>
      prev.map(s => s.id === updatedSalon.id ? {
        ...updatedSalon,
        updated_by: user?.username || "Admin",
        updated_date: new Date().toISOString()
      } : s)
    );
    setEditModalOpen(false);
    toast.success("Salon updated successfully");
  };

  const getRowColor = (position) => {
    switch (position) {
      case 'yellow':
        return 'bg-yellow-50';
      case 'orange':
        return 'bg-orange-50';
      case 'red':
        return 'bg-red-50';
      default:
        return 'bg-white';
    }
  };

  const getConversionProgress = (converted, total) => {
    return total > 0 ? (converted / total) * 100 : 0;
  };

  const getConversionColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-[#502DA6]';
    if (percentage >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  useEffect(() => {
    getCollaboratedSalons();
  }, []);

  const getCollaboratedSalons = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/collaborated/`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setCollaboratedSalons(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const deleteCollaboratedSalons = async (collaboratedId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/collaborated/${collaboratedId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setCollaboratedSalons(prev => prev.filter(p => p.id !== collaboratedId));
        toast.success("Deleted Successfully !!");
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please log in again");
      } else {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  const sendBulkWhatsAppAlerts = () => {
    if (selectedSalons.length === 0) {
      toast.error("No salons selected");
      return;
    }

    const selectedData = collaboratedSalons.filter(salon =>
      selectedSalons.includes(salon.id)
    );

    const message = `BULK ALERT FOR SELECTED SALONS%0A%0A` +
      selectedData.map(salon =>
        `${salon.salon.name} - ${salon.total_converted_leads}/${salon.no_of_leads} leads (Status: ${salon.salon_position || 'normal'})`
      ).join("%0A");

    const whatsappUrl = `https://api.whatsapp.com/send?phone=919328382710&text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const deleteSelectedSalons = async () => {
    if (selectedSalons.length === 0) {
      toast.error("No salons selected");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedSalons.length} selected salons?`
    );
    if (!confirmDelete) return;

    try {
      const deletePromises = selectedSalons.map(id =>
        fetch(`https://backendapi.trakky.in/salons/collaborated/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        })
      );

      const results = await Promise.all(deletePromises);
      const allSuccess = results.every(res => res.status === 204);

      if (allSuccess) {
        setCollaboratedSalons(prev =>
          prev.filter(p => !selectedSalons.includes(p.id))
        );
        setSelectedSalons([]);
        toast.success(`Deleted ${selectedSalons.length} salons successfully!`);
      } else {
        throw new Error("Some deletions failed");
      }
    } catch (error) {
      toast.error("Error deleting some salons");
    }
  };

  const sendWhatsAppAlert = (salon) => {
    const message = `ALERT%0A%0AIt is to notify that the salon name - ${salon.salon.name}-${salon.salon.area}-${salon.salon.city}, whose package had started from the date - ${formatDate(new Date(salon.package_starting_date))} and ending date - ${formatDate(new Date(salon.package_expire_date))} had completed only ${salon.total_converted_leads} leads out of the ${salon.no_of_leads}.%0A%0AFocus more on the conversion of the leads for this salon - ${salon.salon.name}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=919328382710&text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendBulkAlerts = () => {
    const filtered = filteredCollaboratedSalons.filter(salon =>
      activeColorFilter === "all" || salon.salon_position === activeColorFilter
    );

    if (filtered.length === 0) {
      toast.error("No salons to alert in this section");
      return;
    }

    const message = `ALERT FOR ${activeColorFilter.toUpperCase()} SECTION%0A%0A` +
      filtered.map(salon =>
        `${salon.salon.name} - ${salon.total_converted_leads}/${salon.no_of_leads} leads (Expires: ${formatDate(new Date(salon.package_expire_date))})`
      ).join("%0A");

    const whatsappUrl = `https://api.whatsapp.com/send?phone=919328382710&text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, dateState, isDateFilterOn, activeColorFilter, collaboratedSalons]);

  const handleSearch = () => {
    let filtered = [...collaboratedSalons];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((salon) => {
        const searchValue = searchTerm.toLowerCase();
        switch (searchOption) {
          case "name":
            return salon.salon.name.toLowerCase().includes(searchValue);
          case "city":
            return salon.salon.city.toLowerCase().includes(searchValue);
          case "area":
            return salon.salon.area.toLowerCase().includes(searchValue);
          default:
            return true;
        }
      });
    }

    if (isDateFilterOn && dateState[0].startDate && dateState[0].endDate) {
      const startDate = new Date(dateState[0].startDate);
      const endDate = new Date(dateState[0].endDate);

      filtered = filtered.filter((salon) => {
        const packageStart = new Date(salon.package_starting_date);
        const packageEnd = new Date(salon.package_expire_date);

        return (
          (packageStart >= startDate && packageStart <= endDate) ||
          (packageEnd >= startDate && packageEnd <= endDate) ||
          (packageStart <= startDate && packageEnd >= endDate)
        );
      });
    }

    if (activeColorFilter !== "all") {
      if (activeColorFilter === "white") {
        filtered = filtered.filter(salon =>
          !salon.salon_position ||
          !["red", "orange", "yellow"].includes(salon.salon_position)
        );
      } else {
        filtered = filtered.filter(salon => salon.salon_position === activeColorFilter);
      }
    }

    setFilteredCollaboratedSalons(filtered);
    setPage(0);
  };

  const clearDateFilter = () => {
    setDateState([{ startDate: null, endDate: null, key: "selection" }]);
    setIsDateFilterOn(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedSalons = filteredCollaboratedSalons.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isSelectionMode = selectedSalons.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      />

    {/* Header Section */}
<div className="mx-auto px-3 sm:px-4 mb-4 sm:mb-6">
  <div className="bg-gradient-to-r from-[#502DA6] to-indigo-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 lg:p-8 text-white">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
      
      {/* Left Section - Title and Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
            Collaborated Salons
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 opacity-90">
            Manage and monitor your salon partnerships
          </p>
        </div>
        
        {isSelectionMode && (
          <span className="inline-flex items-center self-start sm:self-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-500 text-white text-xs sm:text-sm font-medium whitespace-nowrap">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1.5 sm:mr-2"></span>
            {selectedSalons.length} Selected
          </span>
        )}
      </div>

      {/* Right Section - Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
        <button
          onClick={getCollaboratedSalons}
          className="flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-colors text-sm sm:text-base"
        >
          <RefreshIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span>Refresh</span>
        </button>
        
        <Link
          to="/addcollaborated"
          className="flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-2 bg-white text-[#502DA6] font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
        >
          <AddIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span>Add Salon</span>
        </Link>
      </div>

    </div>
  </div>
</div>

      {/* Statistics Cards */}
      <div className=" mx-auto px-4  mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Collaborated Salons</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BusinessCenter className="w-6 h-6 text-[#502DA6]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalLeads}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Converted Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalConverted}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Analytics className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Avg Conversion</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.avgConversion}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Schedule className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className=" mx-auto px-4  mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-2">
              <select
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {searchOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search by ${searchOptions.find(o => o.value === searchOption)?.label}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <button
                onClick={() => setShowDateSelectionModal(true)}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
                  isDateFilterOn
                    ? "bg-[#502DA6] text-white border-[#502DA6]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <CalendarMonth className="w-5 h-5 mr-2" />
                {isDateFilterOn ? "Date Filter Active" : "Filter by Date"}
              </button>
            </div>

            <div className="md:col-span-3">
              {isDateFilterOn && (
                <button
                  onClick={clearDateFilter}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 bg-white rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Close className="w-5 h-5 mr-2" />
                  Clear Date Filter
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {colorFilters.map(filter => (
                  <div key={filter.name} className="flex items-center">
                    <button
                      onClick={() => setActiveColorFilter(filter.name)}
                      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeColorFilter === filter.name
                          ? `bg-${filter.color}-600 text-white`
                          : `bg-white text-${filter.color}-600 border border-${filter.color}-600 hover:bg-${filter.color}-50`
                      }`}
                    >
                      {filter.icon}
                      <span className="ml-2">{filter.label}</span>
                    </button>
                    {['red', 'orange', 'yellow'].includes(filter.name) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInfoClick(filter.name);
                        }}
                        className="ml-1 p-1 text-gray-500 hover:text-gray-700 rounded"
                      >
                        <VisibilityIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={sendBulkAlerts}
                disabled={filteredCollaboratedSalons.length === 0}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <WhatsApp className="w-5 h-5 mr-2" />
                Alert {activeColorFilter === "all" ? "All" : "Section"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Salons Bar */}
      {isSelectionMode && (
        <div className=" mx-auto px-4  mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {selectedSalons.length} selected
                </span>
                <button
                  onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    showSelectedOnly
                      ? "bg-[#502DA6] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showSelectedOnly ? "Show All" : "Show Selected"}
                </button>
                <button
                  onClick={deleteSelectedSalons}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={sendBulkWhatsAppAlerts}
                  className="px-3 py-1 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700 transition-colors"
                >
                  Send Alerts
                </button>
              </div>
              <button
                onClick={() => {
                  setShowSelectedOnly(false);
                  clearSelection();
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className=" mx-auto px-4 ">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={paginatedSalons.length > 0 && selectedSalons.length === paginatedSalons.length}
                      onChange={handleSelectAllClick}
                      className="w-4 h-4 text-[#502DA6] border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salon Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Add Spend</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Period</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#502DA6]"></div>
                        <span className="text-gray-600">Loading salons...</span>
                      </div>
                    </td>
                  </tr>
                ) : (showSelectedOnly ? paginatedSalons.filter(salon => selectedSalons.includes(salon.id)) : paginatedSalons).length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center">
                      <div className="text-gray-500 text-lg">
                        {showSelectedOnly ? "No selected salons found" : "No salons found matching your criteria"}
                      </div>
                    </td>
                  </tr>
                ) : (
                  (showSelectedOnly ? paginatedSalons.filter(salon => selectedSalons.includes(salon.id)) : paginatedSalons)
                    .map((salon, index) => {
                      const isItemSelected = isSelected(salon.id);
                      return (
                        <tr
                          key={salon.id}
                          className={`${getRowColor(salon.salon_position)} hover:bg-gray-50 transition-colors ${
                            isItemSelected ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={isItemSelected}
                              onChange={(event) => handleCheckboxClick(event, salon.id)}
                              className="w-4 h-4 text-[#502DA6] border-gray-300 rounded focus:ring-indigo-500"
                            />
                          </td>

                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                            {page * rowsPerPage + index + 1}
                          </td>

                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {salon.salon.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {salon.id}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm text-gray-900 flex items-center">
                                <LocationOn className="w-4 h-4 mr-1 text-gray-400" />
                                {salon.salon.city}
                              </div>
                              <div className="text-xs text-gray-500">
                                {salon.salon.area}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 hover:shadow-md transition-all">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-indigo-700">
                                  {salon.total_converted_leads} / {salon.no_of_leads}
                                </span>
                                <span className={`text-sm font-semibold ${
                                  salon.percentage_conversion >= 80 ? 'text-green-600' :
                                  salon.percentage_conversion >= 60 ? 'text-[#502DA6]' :
                                  salon.percentage_conversion >= 40 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {salon.percentage_conversion}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getConversionColor(salon.percentage_conversion)}`}
                                  style={{ width: `${getConversionProgress(salon.total_converted_leads, salon.no_of_leads)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleSpendDetailsClick(salon)}
                              className="px-3 py-1 border border-[#502DA6] text-[#502DA6] rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                            >
                              Spend Details
                            </button>
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-500">
                            <div>
                              <div>Start: {formatDate(new Date(salon.package_starting_date))}</div>
                              <div>End: {formatDate(new Date(salon.package_expire_date))}</div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              salon.salon_position === 'red'
                                ? 'bg-red-100 text-red-800'
                                : salon.salon_position === 'orange'
                                ? 'bg-orange-100 text-orange-800'
                                : salon.salon_position === 'yellow'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {salon.salon_position === 'red' ? 'Critical' :
                               salon.salon_position === 'orange' ? 'Warning' :
                               salon.salon_position === 'yellow' ? 'Attention' : 'Normal'}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-500">
                            <div>
                              <div>{salon.updated_by || 'N/A'}</div>
                              <div>{salon.updated_date ? formatDate(new Date(salon.updated_date)) : 'N/A'}</div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleEditClick(salon)}
                                className="p-1 text-[#502DA6] hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                                title="Edit Salon"
                              >
                                <EditIcon className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => deleteCollaboratedSalons(salon.id)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                title="Delete Salon"
                              >
                                <DeleteIcon className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => sendWhatsAppAlert(salon)}
                                className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded transition-colors"
                                title="Send Alert"
                              >
                                <WhatsApp className="w-4 h-4" />
                              </button>

                              <Link
                                to={`/collaborated/${salon.id}`}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                                title="View Details"
                              >
                                <ViewIcon className="w-4 h-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[5, 10, 25].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Page {page + 1} of {Math.ceil(filteredCollaboratedSalons.length / rowsPerPage)}
                </span>
                <button
                  onClick={(e) => handleChangePage(e, page - 1)}
                  disabled={page === 0}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={(e) => handleChangePage(e, page + 1)}
                  disabled={page >= Math.ceil(filteredCollaboratedSalons.length / rowsPerPage) - 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DateRangeModal
        open={showDateSelectionModal}
        onClose={() => setShowDateSelectionModal(false)}
        dateState={dateState}
        setDateState={setDateState}
        setIsDateFilterOn={setIsDateFilterOn}
      />

      <EditSalonModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        salon={currentSalon}
        onSuccess={handleEditSuccess}
      />

      <SectionInfoModal
        open={infoModalOpen}
        onClose={handleInfoClose}
        section={currentInfoSection}
      />

      <SpendDetailsModal
        open={spendModalOpen}
        onClose={handleSpendModalClose}
        salon={selectedSalonSpend}
      />
    </div>
  );
};

export default CollaboratedSalons;