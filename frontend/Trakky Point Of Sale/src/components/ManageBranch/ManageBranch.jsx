import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddNewBranch from "./AddNewBranch/AddNewBranch";

// Custom color constant
const PRIMARY_COLOR = "#492DBD";

// Main ManageBranch Component
const ManageBranch = () => {
  return <BranchList />;
};

// Branch Change Modal Component
const BranchChangeModal = ({ isOpen, onClose, branchName }) => {
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setShowSuccess(false);
      
      // Simulate loading effect for 10 seconds
      const timer = setTimeout(() => {
        setLoading(false);
        setShowSuccess(true);
        
        // Auto close after showing success for 2 seconds
        const closeTimer = setTimeout(() => {
          onClose();
        }, 2000);
        
        return () => clearTimeout(closeTimer);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-6 pt-8 pb-8">
            {loading ? (
              // Loading State
              <div className="text-center">
                <div className="relative mb-6">
                  {/* Animated Branch Icon */}
                  <div className="animate-pulse">
                    <svg
                      className="w-14 h-14 mx-auto"
                      style={{ color: PRIMARY_COLOR }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  
                  {/* Rotating Circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="w-24 h-24 border-4 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: `${PRIMARY_COLOR}20`, borderTopColor: PRIMARY_COLOR }}
                    ></div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Switching Branch
                </h3>
                <p className="text-gray-500 mb-4">
                  Please wait while we change the branch to{" "}
                  <span className="font-semibold" style={{ color: PRIMARY_COLOR }}>
                    {branchName}
                  </span>
                </p>

                {/* Loading Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="h-full rounded-full animate-progress"
                    style={{
                      backgroundColor: PRIMARY_COLOR,
                      animation: "progress 10s linear forwards",
                    }}
                  ></div>
                </div>

                <p className="text-sm text-gray-400">This will take just a moment...</p>
              </div>
            ) : showSuccess ? (
              // Success State
              <div className="text-center">
                <div className="mb-6">
                  <div
                    className="w-20 h-20 mx-auto rounded-full flex items-center justify-center animate-bounce"
                    style={{ backgroundColor: "#98f5b1" }}
                  >
                    <svg
                      className="w-10 h-10"
                      style={{ color: "green" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Branch Changed Successfully!
                </h3>
                <p className="text-gray-500 mb-4">
                  You are now viewing{" "}
                  <span className="font-semibold" style={{ color: PRIMARY_COLOR }}>
                    {branchName}
                  </span>
                </p>

                {/* Success Check Animation */}
                <div className="flex justify-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: PRIMARY_COLOR,
                        animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 10s linear forwards;
        }
      `}</style>
    </div>
  );
};

// Main Branch List Component
const BranchList = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBranchChangeModalOpen, setIsBranchChangeModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: "Main Headquarters",
      code: "HQ-001",
      address: "123 Business Avenue, New York, NY 10001",
      phone: "+1 (212) 555-0123",
      email: "hq@company.com",
      manager: "John Smith",
      employees: 156,
      status: "active",
      revenue: "$12.5M",
      region: "North America",
      type: "Headquarters",
      established: "2015-06-15",
      timezone: "EST (UTC-5)",
      image:
        "https://trakky-image-h6bea2g2ahf5hkav.z01.azurefd.net/trakky-new-pics/salon_mul_images/ce1d9d0f-fb73-4a7c-ab5c-bd678a228fbb.webp",
      performance: 94,
      description:
        "Our main headquarters and corporate office handling global operations.",
      facilities: [
        "Executive Suites",
        "Conference Center",
        "Cafeteria",
        "Gym",
        "Parking",
      ],
      departments: ["Executive", "Finance", "HR", "IT", "Marketing", "Sales"],
      workingHours: "9:00 AM - 6:00 PM",
      holidaySchedule: "US Federal Holidays",
      emergencyContact: "+1 (212) 555-0199",
    },
    {
      id: 2,
      name: "West Coast Branch",
      code: "WC-002",
      address: "456 Tech Boulevard, San Francisco, CA 94105",
      phone: "+1 (415) 555-0456",
      email: "westcoast@company.com",
      manager: "Sarah Johnson",
      employees: 89,
      status: "active",
      revenue: "$8.2M",
      region: "North America",
      type: "Regional Office",
      established: "2017-09-20",
      timezone: "PST (UTC-8)",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500",
      performance: 88,
      description: "West coast regional office serving the Pacific region.",
      facilities: ["Open Office", "Meeting Rooms", "Cafeteria", "Parking"],
      departments: ["Sales", "Marketing", "Customer Support"],
      workingHours: "8:30 AM - 5:30 PM",
      holidaySchedule: "US Federal Holidays",
      emergencyContact: "+1 (415) 555-0199",
    },
  ]);

  const [SearchQuery, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");

  const handleAddBranch = (newBranch) => {
    setBranches([...branches, newBranch]);
  };

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    setIsBranchChangeModalOpen(true);
  };

  const handleModalClose = () => {
    setIsBranchChangeModalOpen(false);
    setSelectedBranch(null);
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const filteredBranches = branches
    .filter(
      (branch) =>
        branch.name.toLowerCase().includes(SearchQuery.toLowerCase()) ||
        branch.code.toLowerCase().includes(SearchQuery.toLowerCase()) ||
        branch.manager.toLowerCase().includes(SearchQuery.toLowerCase()),
    )
    .filter(
      (branch) => filterStatus === "all" || branch.status === filterStatus,
    )
    .filter(
      (branch) => filterRegion === "all" || branch.region === filterRegion,
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "employees") return b.employees - a.employees;
      if (sortBy === "revenue")
        return (
          parseFloat(b.revenue.replace(/[^0-9.-]+/g, "")) -
          parseFloat(a.revenue.replace(/[^0-9.-]+/g, ""))
        );
      return 0;
    });

  const regions = [...new Set(branches.map((b) => b.region))];

  return (
    <>
      <div className="">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
           <div>
  <h1 className="text-2xl font-bold text-gray-800">
    Branch Management
  </h1>
  <p className="text-gray-500 mt-1">
    Easily manage and monitor all your business branches from one dashboard.
  </p>
</div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 transform "
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Create New Branch</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Branches</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {branches.length}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: PRIMARY_COLOR + "20" }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: PRIMARY_COLOR }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Branches</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {branches.filter((b) => b.status === "active").length}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: PRIMARY_COLOR + "20" }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: PRIMARY_COLOR }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {branches.reduce((acc, b) => acc + b.employees, 0)}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: PRIMARY_COLOR + "20" }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: PRIMARY_COLOR }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${branches.reduce((acc, b) => acc + parseFloat(b.revenue.replace(/[^0-9.-]+/g, "")), 0)}M
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: PRIMARY_COLOR + "20" }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: PRIMARY_COLOR }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search branches by name, code, or manager..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{ focusRingColor: PRIMARY_COLOR }}
                  value={SearchQuery}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2"
              style={{ focusRingColor: PRIMARY_COLOR }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2"
              style={{ focusRingColor: PRIMARY_COLOR }}
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
            >
              <option value="all">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2"
              style={{ focusRingColor: PRIMARY_COLOR }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="employees">Sort by Employees</option>
              <option value="revenue">Sort by Revenue</option>
            </select>

            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button
                className={`px-4 py-3 ${
                  viewMode === "grid" ? "text-white" : "text-gray-600"
                }`}
                style={{
                  backgroundColor:
                    viewMode === "grid" ? PRIMARY_COLOR : "transparent",
                }}
                onClick={() => setViewMode("grid")}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                className={`px-4 py-3 ${
                  viewMode === "list" ? "text-white" : "text-gray-600"
                }`}
                style={{
                  backgroundColor:
                    viewMode === "list" ? PRIMARY_COLOR : "transparent",
                }}
                onClick={() => setViewMode("list")}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Branches Grid/List View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleBranchClick(branch)}
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        branch.status,
                      )}`}
                    >
                      {branch.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {branch.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Code: {branch.code}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-3"
                        style={{ color: PRIMARY_COLOR }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-sm">Manager: {branch.manager}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-3"
                        style={{ color: PRIMARY_COLOR }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm truncate">{branch.address}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-3"
                        style={{ color: PRIMARY_COLOR }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">{branch.timezone}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Employees</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {branch.employees}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Revenue</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {branch.revenue}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Performance</p>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-gray-900 mr-2">
                            {branch.performance}%
                          </span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${branch.performance}%`,
                                backgroundColor: PRIMARY_COLOR,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employees
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBranches.map((branch) => (
                  <tr
                    key={branch.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleBranchClick(branch)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg overflow-hidden">
                          <img
                            src={branch.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {branch.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {branch.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {branch.manager}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {branch.region}
                      </div>
                      <div className="text-sm text-gray-500">{branch.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {branch.employees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {branch.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          branch.status,
                        )}`}
                      >
                        {branch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        style={{ color: PRIMARY_COLOR }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Branch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-900 opacity-75"
                onClick={() => setIsAddModalOpen(false)}
              ></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="max-h-[90vh] overflow-y-auto">
                <AddNewBranch
                  onClose={() => setIsAddModalOpen(false)}
                  onAdd={handleAddBranch}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Branch Change Modal */}
      <BranchChangeModal
        isOpen={isBranchChangeModalOpen}
        onClose={handleModalClose}
        branchName={selectedBranch?.name}
      />
    </>
  );
};

// Branch Details Component
export const BranchDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [branch, setBranch] = useState(null);

  useEffect(() => {
    // Simulate fetching branch details
    const fetchBranch = () => {
      const branches = [
        {
          id: 1,
          name: "Main Headquarters",
          code: "HQ-001",
          address: "123 Business Avenue, New York, NY 10001",
          phone: "+1 (212) 555-0123",
          email: "hq@company.com",
          manager: "John Smith",
          employees: 156,
          status: "active",
          revenue: "$12.5M",
          region: "North America",
          type: "Headquarters",
          established: "2015-06-15",
          timezone: "EST (UTC-5)",
          image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500",
          performance: 94,
          description:
            "Our main headquarters and corporate office handling global operations.",
          facilities: [
            "Executive Suites",
            "Conference Center",
            "Cafeteria",
            "Gym",
            "Parking",
          ],
          departments: [
            "Executive",
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Sales",
          ],
          workingHours: "9:00 AM - 6:00 PM",
          holidaySchedule: "US Federal Holidays",
          emergencyContact: "+1 (212) 555-0199",
        },
      ];
      setBranch(branches.find((b) => b.id === parseInt(id)));
    };
    fetchBranch();
  }, [id]);

  if (!branch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: PRIMARY_COLOR }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Branches
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative h-80 rounded-3xl overflow-hidden mb-8">
          <img
            src={branch.image}
            alt={branch.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-4xl font-bold text-white">{branch.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  branch.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {branch.status}
              </span>
            </div>
            <p className="text-white/90 text-lg">Code: {branch.code}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {branch.employees}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Annual Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {branch.revenue}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Performance Score</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {branch.performance}%
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Established</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {new Date(branch.established).getFullYear()}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About
              </h2>
              <p className="text-gray-600">{branch.description}</p>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 mt-1"
                    style={{ color: PRIMARY_COLOR }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-sm text-gray-600">{branch.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 mt-1"
                    style={{ color: PRIMARY_COLOR }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-600">{branch.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 mt-1"
                    style={{ color: PRIMARY_COLOR }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{branch.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 mt-1"
                    style={{ color: PRIMARY_COLOR }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Emergency
                    </p>
                    <p className="text-sm text-gray-600">
                      {branch.emergencyContact}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Departments
              </h2>
              <div className="flex flex-wrap gap-2">
                {branch.departments.map((dept, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: PRIMARY_COLOR + "10",
                      color: PRIMARY_COLOR,
                    }}
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Facilities
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {branch.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      style={{ color: PRIMARY_COLOR }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Management */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Management
              </h2>
              <div className="text-center">
                <div
                  className="w-24 h-24 rounded-full bg-gradient-to-br mx-auto mb-3 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${PRIMARY_COLOR}80)`,
                  }}
                >
                  <span className="text-3xl text-white font-semibold">
                    {branch.manager
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {branch.manager}
                </h3>
                <p className="text-sm text-gray-500">Branch Manager</p>
              </div>
            </div>

            {/* Operational Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Operational Hours
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Working Hours:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {branch.workingHours}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time Zone:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {branch.timezone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Holidays:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {branch.holidaySchedule}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Edit Branch</span>
                </button>
                <button
                  className="w-full py-3 px-4 rounded-xl text-white flex items-center justify-center space-x-2 transition-all duration-300"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>Contact Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBranch;