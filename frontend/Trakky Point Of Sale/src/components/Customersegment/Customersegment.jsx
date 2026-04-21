import {
  EyeIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  ChevronDown,
  Smartphone,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import "./CustomerSegmentation.css";
import toast from "react-hot-toast";

const CustomerSegmentation = () => {
  const [segments, setSegments] = useState({
    new: { count: 0, results: [] },
    VIP: { count: 0, results: [] },
    potential: { count: 0, results: [] },
    loyal: { count: 0, results: [] },
    needs_attention: { count: 0, results: [] },
    at_risk: { count: 0, results: [] },
    lost: { count: 0, results: [] },
    cant_loose: { count: 0, results: [] },
    about_to_sleep: { count: 0, results: [] },
    potential_loyalist: { count: 0, results: [] },
  });
  const [convertedLeads, setConvertedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const [segmentLoading, setSegmentLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeView, setActiveView] = useState("grid");

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter table data based on search term
  const filteredTableData = tableData.filter((customer) =>
    customer.phone.includes(searchTerm),
  );

  // Fetch initial segmentation counts
  useEffect(() => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch customer segmentation counts for all segments
        const segmentKeys = Object.keys(segments);
        const segmentPromises = segmentKeys.map((key) =>
          fetch(
            `https://backendapi.trakky.in/salons/customer-segmentation/?segment=${key}`,
          ).then((res) => res.json()),
        );

        const segmentResults = await Promise.all(segmentPromises);

        const newSegments = {};
        segmentKeys.forEach((key, index) => {
          newSegments[key] = segmentResults[index];
        });

        setSegments(newSegments);

        // Fetch converted leads data
        const leadsResponse = await fetch(
          "https://backendapi.trakky.in/salons/convertedleads/",
        );
        if (!leadsResponse.ok) {
          throw new Error("Failed to fetch converted leads data");
        }
        const leadsData = await leadsResponse.json();
        setConvertedLeads(leadsData.results);

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Calculate total customers across all segments
  const totalCustomers = Object.values(segments).reduce(
    (total, segment) => total + segment.count,
    0,
  );

  // Function to calculate percentage
  const calculatePercentage = (segment) => {
    if (totalCustomers === 0) return 0;
    return Math.round((segment.count / totalCustomers) * 100);
  };

  // Animation component for counting numbers
  const Counter = ({ target }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const duration = 1200;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        setCount((prev) => {
          const newCount = prev + increment;
          if (newCount >= target) {
            clearInterval(timer);
            return target;
          }
          return newCount;
        });
      }, 16);

      return () => clearInterval(timer);
    }, [target]);

    return <span>{Math.floor(count)}</span>;
  };

  // Fetch segmented customer data with pagination
  const fetchSegmentCustomers = async (segmentKey, page = 1, pageSize = 10) => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      setSegmentLoading(true);
      const response = await fetch(
        `https://backendapi.trakky.in/salons/customer-segmentation/?segment=${segmentKey}&page=${page}&page_size=${pageSize}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch segment customers");
      }

      const data = await response.json();

      // Update pagination
      setPagination({
        currentPage: page,
        pageSize,
        totalCount: data.count,
      });

      return data.results;
    } catch (error) {
      console.error("Error fetching segment customers:", error);
      setError(error.message);
      return [];
    } finally {
      setSegmentLoading(false);
    }
  };

  // Handle segment click (eye icon)
  const handleSegmentClick = async (segmentKey) => {
    setSelectedSegment(segmentKey);
    setSelectedCustomer(null);
    setShowModal(true);
    setIsTableVisible(false);

    // Fetch first page of customers for this segment
    const segmentCustomers = await fetchSegmentCustomers(segmentKey);

    // Find all converted leads for these customers
    const segmentPhones = segmentCustomers;
    const leadsForSegment = convertedLeads.filter((lead) =>
      segmentPhones.includes(lead.customer_mobile_number),
    );

    // Group by customer and collect all leads
    const customerData = {};
    leadsForSegment.forEach((lead) => {
      const phone = lead.customer_mobile_number;
      if (!customerData[phone]) {
        customerData[phone] = {
          count: 0,
          leads: [],
          name: lead.customer_name || "Unknown",
        };
      }
      customerData[phone].count++;
      customerData[phone].leads.push(lead);
    });

    // Transform to array format for table
    const tableData = segmentCustomers.map((phone) => ({
      phone,
      name: customerData[phone]?.name || "Unknown",
      count: customerData[phone]?.count || 0,
      leads: customerData[phone]?.leads || [],
      expanded: false,
    }));

    setTableData(tableData);
    setIsTableVisible(true);
  };

  // Handle pagination change
  const handlePageChanges = async (newPage) => {
    if (
      newPage < 1 ||
      newPage > Math.ceil(pagination.totalCount / pagination.pageSize)
    )
      return;

    const segmentCustomers = await fetchSegmentCustomers(
      selectedSegment,
      newPage,
      pagination.pageSize,
    );

    // Find all converted leads for these customers
    const segmentPhones = segmentCustomers;
    const leadsForSegment = convertedLeads.filter((lead) =>
      segmentPhones.includes(lead.customer_mobile_number),
    );

    // Group by customer and collect all leads
    const customerData = {};
    leadsForSegment.forEach((lead) => {
      const phone = lead.customer_mobile_number;
      if (!customerData[phone]) {
        customerData[phone] = {
          count: 0,
          leads: [],
          name: lead.customer_name || "Unknown",
        };
      }
      customerData[phone].count++;
      customerData[phone].leads.push(lead);
    });

    // Transform to array format for table
    const tableData = segmentCustomers.map((phone) => ({
      phone,
      name: customerData[phone]?.name || "Unknown",
      count: customerData[phone]?.count || 0,
      leads: customerData[phone]?.leads || [],
      expanded: false,
    }));

    setTableData(tableData);
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  // Add a toggle function for expanding/collapsing customer details
  const toggleCustomerExpansion = (phone) => {
    setTableData((prevData) =>
      prevData.map((customer) =>
        customer.phone === phone
          ? { ...customer, expanded: !customer.expanded }
          : customer,
      ),
    );
  };

  // Handle customer click (to show specific customer details)
  const handleCustomerClick = (customerPhone) => {
    setSelectedCustomer(customerPhone);

    // Find all leads for this specific customer
    const customerLeads = convertedLeads.filter(
      (lead) => lead.customer_mobile_number === customerPhone,
    );

    // Show table with animation
    setIsTableVisible(false);
    setTimeout(() => {
      setTableData([
        {
          phone: customerPhone,
          name: customerLeads[0]?.customer_name || "Unknown",
          count: customerLeads.length,
          leads: customerLeads,
        },
      ]);
      setIsTableVisible(true);
    }, 10);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedSegment(null);
    setSelectedCustomer(null);
    setIsTableVisible(false);
  };

  // Get segment display name
  const getSegmentDisplayName = (segmentKey) => {
    const names = {
      new: "New",
      VIP: "Our Member",
      potential: "Potential",
      loyal: "Loyal",
      needs_attention: "Needs Attention",
      at_risk: "At Risk",
      lost: "Lost",
      cant_loose: "VIP Members",
      about_to_sleep: "About to Sleep",
      potential_loyalist: "Potential Loyalist",
    };
    return names[segmentKey] || segmentKey;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error Loading Data</div>
          <div className="text-gray-600 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center justify-center">
          {/* Spinner */}
          <div
            className="w-16 h-16 rounded-full animate-spin 
                                border-[6px] border-solid 
                                border-indigo-600 border-t-transparent"
          ></div>

          {/* Text */}
          <span className="mt-5 text-gray-800 text-base font-medium">
            Loading Segmentation...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="p-3 md:pl-6 lg:pl-24 pl-0">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {isMobile ? (
              <></>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center justify-center font-bold text-lg md:text-xl gap-2">
                  Customer Segmentations
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="h-4 w-4" />
                  <span>
                    Total Customers :{" "}
                    <span className="font-semibold">{totalCustomers}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Grid Layout */}
        {isMobile ? (
          <div className="space-y-3">
            {activeView === "grid" ? (
              // Mobile Grid View
              <div className="grid grid-cols-2 gap-3">
                {/* New */}
                <div
                  className="relative bg-green-100 rounded-lg p-4 overflow-hidden"
                  onClick={() => handleSegmentClick("new")}
                >
                  <div className="text-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold truncate">New</h3>
                      <EyeIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      <Counter target={calculatePercentage(segments.new)} />%
                    </div>
                    <div className="text-xs opacity-80">
                      <Counter target={segments.new.count} /> customers
                    </div>
                  </div>
                </div>

                {/* VIP */}
                <div
                  className="relative bg-blue-100 rounded-lg p-4 overflow-hidden"
                  onClick={() => handleSegmentClick("VIP")}
                >
                  <div className="text-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold truncate">
                        Our Member
                      </h3>
                      <EyeIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      <Counter target={calculatePercentage(segments.VIP)} />%
                    </div>
                    <div className="text-xs opacity-80">
                      <Counter target={segments.VIP.count} /> customers
                    </div>
                  </div>
                </div>

                {/* Loyal */}
                <div
                  className="relative bg-teal-100 rounded-lg p-4 overflow-hidden"
                  onClick={() => handleSegmentClick("loyal")}
                >
                  <div className="text-teal-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold truncate">Loyal</h3>
                      <EyeIcon className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      <Counter target={calculatePercentage(segments.loyal)} />%
                    </div>
                    <div className="text-xs opacity-80">
                      <Counter target={segments.loyal.count} /> customers
                    </div>
                  </div>
                </div>

                {/* Needs Attention */}
                <div
                  className="relative bg-purple-100 rounded-lg p-5 overflow-hidden"
                  onClick={() => handleSegmentClick("needs_attention")}
                >
                  <div className="text-purple-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold truncate">
                        Needs Attention
                      </h3>
                      <EyeIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      <Counter
                        target={calculatePercentage(segments.needs_attention)}
                      />
                      %
                    </div>
                    <div className="text-xs opacity-80">
                      <Counter target={segments.needs_attention.count} />{" "}
                      customers
                    </div>
                  </div>
                </div>

                {/* At Risk */}
                <div
                  className="relative bg-orange-100 rounded-lg p-3 overflow-hidden"
                  onClick={() => handleSegmentClick("at_risk")}
                >
                  <div className="text-orange-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold truncate">
                        At Risk
                      </h3>
                      <EyeIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      <Counter target={calculatePercentage(segments.at_risk)} />
                      %
                    </div>
                    <div className="text-xs opacity-80">
                      <Counter target={segments.at_risk.count} /> Customers
                    </div>
                  </div>
                </div>

                {/* Lost */}
                <div
                  className="relative bg-red-100 rounded-lg p-4 overflow-hidden"
                  onClick={() => handleSegmentClick("lost")}
                >
                  <div className="text-red-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold truncate">Lost</h3>
                      <EyeIcon className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      <Counter target={calculatePercentage(segments.lost)} />%
                    </div>
                    <div className="text-xs opacity-80">
                      <Counter target={segments.lost.count} /> customers
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Mobile List View
              <div className="space-y-2">
                {Object.entries(segments).map(([key, segment]) => (
                  <div
                    key={key}
                    className="relative bg-gray-50 rounded-lg p-4 overflow-hidden border border-gray-200"
                    onClick={() => handleSegmentClick(key)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {getSegmentDisplayName(key)}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="text-lg font-bold text-gray-900">
                            <Counter target={calculatePercentage(segment)} />%
                          </div>
                          <div className="text-xs text-gray-600">
                            <Counter target={segment.count} /> customers
                          </div>
                        </div>
                      </div>
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Desktop Grid Layout
          <div className="space-y-4">
            {/* First Row: Large cards + 2x2 small grid */}
            <div className="flex gap-4">
              {/* New - Large */}
              <div
                className="relative bg-green-200 rounded-lg p-6 overflow-hidden flex-1 min-h-[200px]"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                                        45deg,
                                        transparent,
                                        transparent 8px,
                                        rgba(255,255,255,0.1) 8px,
                                        rgba(255,255,255,0.1) 16px
                                    )`,
                }}
              >
                <div className="text-green-800 h-full flex flex-col justify-between">
                  <h3 className="customer-segment-title text-lg">
                    New
                    <span
                      className="eye-icon-wrapper ml-1 cursor-pointer"
                      onClick={() => handleSegmentClick("new")}
                    >
                      <EyeIcon className="eye-icon h-4 w-4" />
                    </span>
                  </h3>
                  <div>
                    <div className="text-4xl font-bold mb-2">
                      <Counter target={calculatePercentage(segments.new)} />%
                    </div>
                    <div
                      className="text-sm opacity-80 cursor-pointer hover:underline"
                      onClick={() => handleSegmentClick("new")}
                    >
                      <Counter target={segments.new.count} /> customers
                    </div>
                  </div>
                </div>
              </div>

              {/* VIP - Large */}
              <div
                className="relative bg-blue-200 rounded-lg p-6 overflow-hidden flex-1 min-h-[200px]"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                                        45deg,
                                        transparent,
                                        transparent 8px,
                                        rgba(255,255,255,0.1) 8px,
                                        rgba(255,255,255,0.1) 16px
                                    )`,
                }}
              >
                <div className="text-blue-800 h-full flex flex-col justify-between">
                  <h3 className="customer-segment-title text-lg">
                    Our Member
                    <span
                      className="eye-icon-wrapper ml-1 cursor-pointer"
                      onClick={() => handleSegmentClick("VIP")}
                    >
                      <EyeIcon className="eye-icon h-4 w-4" />
                    </span>
                  </h3>
                  <div>
                    <div className="text-4xl font-bold mb-2">
                      <Counter target={calculatePercentage(segments.VIP)} />%
                    </div>
                    <div
                      className="text-sm opacity-80 cursor-pointer hover:underline"
                      onClick={() => handleSegmentClick("VIP")}
                    >
                      <Counter target={segments.VIP.count} /> customers
                    </div>
                  </div>
                </div>
              </div>

              {/* 2x2 Grid of small cards */}
              <div className="grid grid-cols-2 gap-2 flex-1">
                {/* Loyal */}
                <div
                  className="relative bg-teal-200 rounded-lg p-3 overflow-hidden min-h-[96px]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                                            45deg,
                                            transparent,
                                            transparent 8px,
                                            rgba(255,255,255,0.1) 8px,
                                            rgba(255,255,255,0.1) 16px
                                        )`,
                  }}
                >
                  <div className="text-teal-800 h-full flex flex-col justify-between">
                    <h3 className="customer-segment-title text-sm">
                      Loyal
                      <span
                        className="eye-icon-wrapper ml-1 cursor-pointer"
                        onClick={() => handleSegmentClick("loyal")}
                      >
                        <EyeIcon className="eye-icon h-3 w-3" />
                      </span>
                    </h3>
                    <div>
                      <div className="text-xl font-bold mb-1">
                        <Counter target={calculatePercentage(segments.loyal)} />
                        %
                      </div>
                      <div
                        className="text-xs opacity-80 cursor-pointer hover:underline"
                        onClick={() => handleSegmentClick("loyal")}
                      >
                        <Counter target={segments.loyal.count} /> customers
                      </div>
                    </div>
                  </div>
                </div>

                {/* Needs Attention */}
                <div
                  className="relative bg-purple-200 rounded-lg p-3 overflow-hidden min-h-[96px]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                                            45deg,
                                            transparent,
                                            transparent 8px,
                                            rgba(255,255,255,0.1) 8px,
                                            rgba(255,255,255,0.1) 16px
                                        )`,
                  }}
                >
                  <div className="text-purple-800 h-full flex flex-col justify-between">
                    <h3 className="customer-segment-title text-sm">
                      Needs Attention
                      <span
                        className="eye-icon-wrapper ml-1 cursor-pointer"
                        onClick={() => handleSegmentClick("needs_attention")}
                      >
                        <EyeIcon className="eye-icon h-3 w-3" />
                      </span>
                    </h3>
                    <div>
                      <div className="text-xl font-bold mb-1">
                        <Counter
                          target={calculatePercentage(segments.needs_attention)}
                        />
                        %
                      </div>
                      <div
                        className="text-xs opacity-80 cursor-pointer hover:underline"
                        onClick={() => handleSegmentClick("needs_attention")}
                      >
                        <Counter target={segments.needs_attention.count} />{" "}
                        customers
                      </div>
                    </div>
                  </div>
                </div>

                {/* At Risk */}
                <div
                  className="relative bg-orange-200 rounded-lg p-3 overflow-hidden min-h-[96px]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                                            45deg,
                                            transparent,
                                            transparent 8px,
                                            rgba(255,255,255,0.1) 8px,
                                            rgba(255,255,255,0.1) 16px
                                        )`,
                  }}
                >
                  <div className="text-orange-800 h-full flex flex-col justify-between">
                    <h3 className="customer-segment-title text-sm">
                      At Risk
                      <span
                        className="eye-icon-wrapper ml-1 cursor-pointer"
                        onClick={() => handleSegmentClick("at_risk")}
                      >
                        <EyeIcon className="eye-icon h-3 w-3" />
                      </span>
                    </h3>
                    <div>
                      <div className="text-xl font-bold mb-1">
                        <Counter
                          target={calculatePercentage(segments.at_risk)}
                        />
                        %
                      </div>
                      <div
                        className="text-xs opacity-80 cursor-pointer hover:underline"
                        onClick={() => handleSegmentClick("at_risk")}
                      >
                        <Counter target={segments.at_risk.count} /> customers
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lost */}
                <div
                  className="relative bg-red-200 rounded-lg p-3 overflow-hidden min-h-[96px]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                                            45deg,
                                            transparent,
                                            transparent 8px,
                                            rgba(255,255,255,0.1) 8px,
                                            rgba(255,255,255,0.1) 16px
                                        )`,
                  }}
                >
                  <div className="text-red-800 h-full flex flex-col justify-between">
                    <h3 className="customer-segment-title text-sm">
                      Lost
                      <span
                        className="eye-icon-wrapper ml-1 cursor-pointer"
                        onClick={() => handleSegmentClick("lost")}
                      >
                        <EyeIcon className="eye-icon h-3 w-3" />
                      </span>
                    </h3>
                    <div>
                      <div className="text-xl font-bold mb-1">
                        <Counter target={calculatePercentage(segments.lost)} />%
                      </div>
                      <div
                        className="text-xs opacity-80 cursor-pointer hover:underline"
                        onClick={() => handleSegmentClick("lost")}
                      >
                        <Counter target={segments.lost.count} /> customers
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row: Remaining sections */}
            <div className="grid grid-cols-4 gap-4">
              {/* Lost */}
              <div
                className="relative bg-red-200 rounded-lg p-4 min-h-[128px] overflow-hidden"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                                        45deg,
                                        transparent,
                                        transparent 8px,
                                        rgba(255,255,255,0.1) 8px,
                                        rgba(255,255,255,0.1) 16px
                                    )`,
                }}
              >
                <div className="text-red-800 h-full flex flex-col justify-between">
                  <h3 className="customer-segment-title text-sm">
                    Lost
                    <span
                      className="eye-icon-wrapper ml-1 cursor-pointer"
                      onClick={() => handleSegmentClick("lost")}
                    >
                      <EyeIcon className="eye-icon h-3 w-3" />
                    </span>
                  </h3>
                  <div>
                    <div className="text-2xl font-bold mb-1">
                      <Counter target={calculatePercentage(segments.lost)} />%
                    </div>
                    <div
                      className="text-xs opacity-80 cursor-pointer hover:underline"
                      onClick={() => handleSegmentClick("lost")}
                    >
                      <Counter target={segments.lost.count} /> customers
                    </div>
                  </div>
                </div>
              </div>

              {/* VIP Members */}
              <div
                className="relative bg-cyan-200 rounded-lg p-4 min-h-[128px] overflow-hidden"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                                        45deg,
                                        transparent,
                                        transparent 8px,
                                        rgba(255,255,255,0.1) 8px,
                                        rgba(255,255,255,0.1) 16px
                                    )`,
                }}
              >
                <div className="text-cyan-800 h-full flex flex-col justify-between">
                  <h3 className="customer-segment-title text-sm">
                    VIP Members
                    <span
                      className="eye-icon-wrapper ml-1 cursor-pointer"
                      onClick={() => handleSegmentClick("cant_loose")}
                    >
                      <EyeIcon className="eye-icon h-3 w-3" />
                    </span>
                  </h3>
                  <div>
                    <div className="text-2xl font-bold mb-1">
                      <Counter
                        target={calculatePercentage(segments.cant_loose)}
                      />
                      %
                    </div>
                    <div
                      className="text-xs opacity-80 cursor-pointer hover:underline"
                      onClick={() => handleSegmentClick("cant_loose")}
                    >
                      <Counter target={segments.cant_loose.count} /> customers
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Members */}
              <div
                className="relative bg-green-200 rounded-lg p-4 min-h-[128px] overflow-hidden"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                                        45deg,
                                        transparent,
                                        transparent 8px,
                                        rgba(255,255,255,0.1) 8px,
                                        rgba(255,255,255,0.1) 16px
                                    )`,
                }}
              >
                <div className="text-green-800 h-full flex flex-col justify-between">
                  <h3 className="customer-segment-title text-sm">
                    Referral Members
                    <span
                      className="eye-icon-wrapper ml-1 cursor-pointer"
                      onClick={() => handleSegmentClick("cant_loose")}
                    >
                      <EyeIcon className="eye-icon h-3 w-3" />
                    </span>
                  </h3>
                  <div>
                    <div className="text-2xl font-bold mb-1">
                      <Counter
                        target={calculatePercentage(segments.cant_loose)}
                      />
                      %
                    </div>
                    <div
                      className="text-xs opacity-80 cursor-pointer hover:underline"
                      onClick={() => handleSegmentClick("cant_loose")}
                    >
                      <Counter target={segments.cant_loose.count} /> customers
                    </div>
                  </div>
                </div>
              </div>

              {/* Potential */}
              <div
                className="relative bg-yellow-200 rounded-lg p-4 min-h-[128px] overflow-hidden"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                                        45deg,
                                        transparent,
                                        transparent 8px,
                                        rgba(255,255,255,0.1) 8px,
                                        rgba(255,255,255,0.1) 16px
                                    )`,
                }}
              >
                <div className="text-yellow-800 h-full flex flex-col justify-between">
                  <h3 className="customer-segment-title text-sm">
                    Potential
                    <span
                      className="eye-icon-wrapper ml-1 cursor-pointer"
                      onClick={() => handleSegmentClick("potential")}
                    >
                      <EyeIcon className="eye-icon h-3 w-3" />
                    </span>
                  </h3>
                  <div>
                    <div className="text-2xl font-bold mb-1">
                      <Counter
                        target={calculatePercentage(segments.potential)}
                      />
                      %
                    </div>
                    <div
                      className="text-xs opacity-80 cursor-pointer hover:underline"
                      onClick={() => handleSegmentClick("potential")}
                    >
                      <Counter target={segments.potential.count} /> customers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for showing customer details */}
      {showModal && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${
            isMobile ? "items-end" : "items-center"
          }`}
        >
          <div
            className={`bg-white rounded-lg ${
              isMobile
                ? "w-full max-h-[90vh] rounded-t-2xl"
                : "max-w-6xl w-full max-h-[90vh]"
            } overflow-y-auto`}
          >
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start md:items-center mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-bold truncate">
                    {selectedSegment?.replace(/_/g, " ")} Customers
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2 md:line-clamp-3">
                    {selectedSegment === "new" &&
                      "First-time purchasers. These customers represent an opportunity for immediate engagement and conversion into repeat buyers."}
                    {selectedSegment === "VIP" &&
                      "Customers with a cumulative spend exceeding ₹5,000 in the last six months. This segment warrants premium treatment and exclusive offers to maintain high engagement and loyalty."}
                    {selectedSegment === "potential" &&
                      "Customers who have spent between ₹3,000 and ₹5,000 in the last six months. Targeted campaigns can encourage increased spending and transition them into VIPs."}
                    {selectedSegment === "potential_loyalist" &&
                      "Customers with a single visit in the last six months but a high spend exceeding ₹7,000. These customers show high purchasing power and need focused engagement to encourage repeat visits and long-term loyalty."}
                    {selectedSegment === "loyal" &&
                      "Customers with a cumulative spend between ₹2,000 and ₹3,000 in the last six months. These customers demonstrate consistent engagement and can be nurtured for increased lifetime value."}
                    {selectedSegment === "cant_loose" &&
                      "Customers who have visited more than twice in the last six months but with a cumulative spend below ₹2,000. This segment shows engagement but needs incentives or product recommendations to increase their average transaction value."}
                    {selectedSegment === "needs_attention" &&
                      "Customers who have not made a purchase or visited in the last three months. Proactive re-engagement strategies are essential to prevent further disengagement."}
                    {selectedSegment === "about_to_sleep" &&
                      "Customers who have not made a purchase or visited in the last six months. These customers are at high risk of becoming inactive and require immediate intervention."}
                    {selectedSegment === "at_risk" &&
                      "Customers with three or fewer visits in the last twelve months. This segment indicates declining engagement and requires targeted retention efforts."}
                    {selectedSegment === "lost" &&
                      "Customers who have not made a purchase or visited in the last twelve months. While challenging, win-back campaigns can be explored for this segment."}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 ml-4 flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Total Customers: </span>
                    {pagination.totalCount}
                    <span className="ml-3 font-semibold">Showing: </span>
                    {filteredTableData.length} (Page {pagination.currentPage} of{" "}
                    {Math.ceil(pagination.totalCount / pagination.pageSize)})
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full md:w-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by mobile..."
                      className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {segmentLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div
                  className={`transition-all duration-500 ${
                    isTableVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Conversions
                          </th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTableData.length > 0 ? (
                          filteredTableData.map((customer, index) => (
                            <React.Fragment key={index}>
                              <tr
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() =>
                                  toggleCustomerExpansion(customer.phone)
                                }
                              >
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <div className="flex items-center">
                                    <Smartphone className="h-4 w-4 text-gray-400 mr-2" />
                                    {customer.phone}
                                  </div>
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {customer.name}
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {customer.count}
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <button className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">
                                    {customer.expanded ? "Hide" : "Show"}
                                  </button>
                                </td>
                              </tr>
                              {customer.expanded && (
                                <tr>
                                  <td
                                    colSpan="4"
                                    className="px-3 md:px-6 py-4 bg-gray-50"
                                  >
                                    <div className="space-y-3">
                                      {customer.leads.length > 0 ? (
                                        customer.leads.map(
                                          (lead, leadIndex) => (
                                            <div
                                              key={leadIndex}
                                              className="border rounded-lg p-3 md:p-4"
                                            >
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                                <div>
                                                  <p className="text-xs md:text-sm font-medium text-gray-500">
                                                    Salon
                                                  </p>
                                                  <p className="text-sm">
                                                    {lead.salon_info?.name ||
                                                      "N/A"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="text-xs md:text-sm font-medium text-gray-500">
                                                    Appointment Date
                                                  </p>
                                                  <p className="text-sm">
                                                    {lead.appointment_date ||
                                                      "N/A"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="text-xs md:text-sm font-medium text-gray-500">
                                                    Converted Date
                                                  </p>
                                                  <p className="text-sm">
                                                    {lead.converted_date ||
                                                      "N/A"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="text-xs md:text-sm font-medium text-gray-500">
                                                    Price
                                                  </p>
                                                  <p className="text-sm">
                                                    {lead.price || "N/A"}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="mt-3 md:mt-4">
                                                <p className="text-xs md:text-sm font-medium text-gray-500">
                                                  Services
                                                </p>
                                                <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                                                  {lead.masterservice_info?.map(
                                                    (service) => (
                                                      <span
                                                        key={service.id}
                                                        className="px-2 py-1 bg-gray-100 rounded text-xs truncate max-w-[120px] md:max-w-none"
                                                      >
                                                        {service.service_name}
                                                      </span>
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ),
                                        )
                                      ) : (
                                        <div className="text-gray-500 text-center py-4 text-sm">
                                          No conversion records found
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-3 md:px-6 py-4 text-center text-gray-500 text-sm"
                            >
                              No customers found matching your search
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination controls */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 gap-3">
                    <div className="text-sm text-gray-600">
                      Page {pagination.currentPage} of{" "}
                      {Math.ceil(pagination.totalCount / pagination.pageSize)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handlePageChanges(pagination.currentPage - 1)
                        }
                        disabled={pagination.currentPage === 1}
                        className={`px-3 py-2 rounded-lg text-sm flex items-center ${
                          pagination.currentPage === 1
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        <ChevronLeft size={16} />
                        {!isMobile && <span className="ml-1">Prev</span>}
                      </button>
                      <button
                        onClick={() =>
                          handlePageChanges(pagination.currentPage + 1)
                        }
                        disabled={
                          pagination.currentPage >=
                          Math.ceil(pagination.totalCount / pagination.pageSize)
                        }
                        className={`px-3 py-2 rounded-lg text-sm flex items-center ${
                          pagination.currentPage >=
                          Math.ceil(pagination.totalCount / pagination.pageSize)
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {!isMobile && <span className="mr-1">Next</span>}
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSegmentation;