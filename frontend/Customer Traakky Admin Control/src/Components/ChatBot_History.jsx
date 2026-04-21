import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import DateRange from "./DateRange/CustomDateRange";
import { formatDate } from "./DateRange/formatDate";
import dayjs from 'dayjs';

const ChatDetailsModal = ({ open, onClose, chatData, allChats }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateChats, setDateChats] = useState({});

  useEffect(() => {
    if (chatData) {
      const sameNumberChats = allChats.filter(chat =>
        chat.number && chat.number.toString() === chatData.number.toString()
      );

      const groupedByDate = sameNumberChats.reduce((acc, chat) => {
        const date = formatDate(new Date(chat.timestamp), 'DD MMMM, YYYY');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(chat);
        return acc;
      }, {});

      setDateChats(groupedByDate);
      if (chatData.timestamp) {
        setSelectedDate(formatDate(new Date(chatData.timestamp), 'DD MMMM, YYYY'));
      }
    }
  }, [chatData, allChats]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Chat Details for {chatData?.name || 'Unknown User'}
            </h2>
            <p className="text-gray-600 mt-1">
              {chatData?.number || 'No number'} | {formatDate(new Date(chatData?.timestamp))}
            </p>

            {Object.keys(dateChats).length > 1 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500">Previous chats on:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Object.keys(dateChats).map(date => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                        selectedDate === date
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {selectedDate && (
            <div className="p-4 mb-6 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-800">
                  Showing chats from: <span className="font-semibold">{selectedDate}</span>
                </p>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-1 text-[#502DA6] transition-colors rounded hover:bg-indigo-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Flow</h3>

          {dateChats[selectedDate]?.map((chat, chatIndex) => (
            <div key={chatIndex} className="p-4 mb-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-500">
                  {dayjs(chat.timestamp).format('hh:mm A')}
                </span>
              </div>

              <div className="space-y-4">
                {chat?.children?.map((interaction, index) => (
                  <div key={index} className="space-y-3">
                    {/* User Message */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-[#502DA6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#502DA6] mb-1">User</p>
                          <p className="text-sm text-gray-700">{interaction?.quote}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bot Options */}
                    <div className="pl-12">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-600 mb-2">Options Provided</p>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(interaction?.us) ? (
                                interaction.us.map((item, i) => {
                                  let text = '';
                                  if (typeof item === 'string') {
                                    text = item;
                                  } else if (item?.props?.children) {
                                    if (typeof item.props.children === 'string') {
                                      text = item.props.children;
                                    } else if (Array.isArray(item.props.children)) {
                                      text = item.props.children
                                        .filter(child => typeof child === 'string')
                                        .join(' ');
                                    }
                                  }
                                  return text ? (
                                    <span
                                      key={i}
                                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                    >
                                      {text}
                                    </span>
                                  ) : null;
                                })
                              ) : (
                                <span className="text-sm text-gray-500">No options provided</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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

const ChatBot_History = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [dateState, setDateState] = useState([{ startDate: null, endDate: null, key: "selection" }]);
  const [isDateFilterOn, setIsDateFilterOn] = useState(false);
  const [searchOption, setSearchOption] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedChats, setSelectedChats] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [chatDetailsModalOpen, setChatDetailsModalOpen] = useState(false);
  const [selectedChatData, setSelectedChatData] = useState(null);

  const searchOptions = [
    { value: "name", label: "Name" },
    { value: "number", label: "Phone Number" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/chatbox/chatdata/`, {
        headers: {
          Authorization: "Bearer " + String(authTokens?.access),
        },
      });

      if (response.status === 200) {
        const result = await response.json();
        setData(result || []);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
      toast.error("Failed to fetch chat history. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authTokens) {
      fetchData();
    }
  }, [authTokens]);

  const getSelections = (chat) => {
    const cities = [];
    const areas = [];
    const categories = [];

    if (chat.children && Array.isArray(chat.children)) {
      chat.children.forEach(interaction => {
        if (interaction.us && Array.isArray(interaction.us)) {
          interaction.us.forEach(item => {
            let text = '';
            if (typeof item === 'string') {
              text = item;
            } else if (item?.props?.children) {
              if (typeof item.props.children === 'string') {
                text = item.props.children;
              } else if (Array.isArray(item.props.children)) {
                text = item.props.children
                  .filter(child => typeof child === 'string')
                  .join(' ');
              }
            }

            if (text && typeof text === 'string') {
              const lowerText = text.toLowerCase();
              if (lowerText.includes('city') || lowerText.includes('location')) {
                cities.push(text);
              } else if (lowerText.includes('area')) {
                areas.push(text);
              } else if (lowerText.includes('category') || lowerText.includes('service')) {
                categories.push(text);
              }
            }
          });
        }
      });
    }

    return {
      cities: cities.length > 0 ? cities : ['Not selected'],
      areas: areas.length > 0 ? areas : ['Not selected'],
      categories: categories.length > 0 ? categories : ['Not selected']
    };
  };

  const filteredData = data
    .filter(chat => {
      const matchesSearch = searchTerm === "" ||
        (searchOption === "name" && chat.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (searchOption === "number" && chat.number?.toString().includes(searchTerm));

      let matchesDate = true;
      if (isDateFilterOn && dateState[0].startDate && dateState[0].endDate) {
        const chatDate = new Date(chat.timestamp);
        const startDate = new Date(dateState[0].startDate);
        const endDate = new Date(dateState[0].endDate);
        matchesDate = chatDate >= startDate && chatDate <= endDate;
      }

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatistics = () => {
    const total = filteredData.length;
    const withNumber = filteredData.filter(chat => chat.number).length;
    const withConversation = filteredData.filter(chat => chat.children?.length > 0).length;
    const completionRate = total > 0 ? ((withConversation / total) * 100).toFixed(1) : 0;
    return { total, withNumber, withConversation, completionRate };
  };

  const stats = getStatistics();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this chat record?')) {
      try {
        setLoading(true);
        const response = await fetch(`https://backendapi.trakky.in/salons/chatbox/chatdata/${id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + String(authTokens?.access),
          },
        });

        if (response.status === 204) {
          fetchData();
          toast.success("Chat record deleted successfully");
        } else if (response.status === 401) {
          toast.error("Unauthorized: Please log in again");
        } else {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error deleting chat record:', error);
        toast.error("Failed to delete chat record. Please try again later");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = () => {
    setPage(0);
  };

  const clearDateFilter = () => {
    setDateState([{ startDate: null, endDate: null, key: "selection" }]);
    setIsDateFilterOn(false);
    setPage(0);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(parseInt(value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedData.map((chat) => chat.id);
      setSelectedChats(newSelected);
      return;
    }
    setSelectedChats([]);
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selectedChats.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedChats, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedChats.slice(1));
    } else if (selectedIndex === selectedChats.length - 1) {
      newSelected = newSelected.concat(selectedChats.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedChats.slice(0, selectedIndex),
        selectedChats.slice(selectedIndex + 1)
      );
    }

    setSelectedChats(newSelected);
  };

  const isSelected = (id) => selectedChats.indexOf(id) !== -1;

  const clearSelection = () => {
    setSelectedChats([]);
  };

  const handleViewChatDetails = (chat) => {
    setSelectedChatData(chat);
    setChatDetailsModalOpen(true);
  };

  const isSelectionMode = selectedChats.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
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
            ChatBot History
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 opacity-90">
            View and manage chatbot interactions
          </p>
        </div>
        
        {isSelectionMode && (
          <span className="inline-flex items-center self-start sm:self-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-500 text-white text-xs sm:text-sm font-medium whitespace-nowrap">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1.5 sm:mr-2"></span>
            {selectedChats.length} Selected
          </span>
        )}
      </div>

      {/* Right Section - Refresh Button */}
      <button
        onClick={fetchData}
        className="flex items-center justify-center w-full lg:w-auto px-3 sm:px-4 py-2.5 sm:py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-colors text-sm sm:text-base"
      >
        <svg 
          className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        <span>Refresh</span>
      </button>

    </div>
  </div>
</div>

      {/* Statistics Cards */}
      <div className=" mx-auto px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Chats</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#502DA6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">With Phone</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.withNumber}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">With Conversation</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.withConversation}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className=" mx-auto px-4 mb-6">
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
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      handleSearch();
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
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
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {isDateFilterOn ? "Date Filter Active" : "Filter by Date"}
              </button>
            </div>

            <div className="md:col-span-3">
              {isDateFilterOn && (
                <button
                  onClick={clearDateFilter}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 bg-white rounded-lg hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Date Filter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Chats Bar */}
      {isSelectionMode && (
        <div className=" mx-auto px-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {selectedChats.length} selected
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
                  onClick={() => {
                    selectedChats.forEach(id => handleDelete(id));
                    clearSelection();
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Selected
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
      <div className=" mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && selectedChats.length === paginatedData.length}
                      onChange={handleSelectAllClick}
                      className="w-4 h-4 text-[#502DA6] border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City Selections</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area Selections</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Selections</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Interaction</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#502DA6]"></div>
                        <span className="text-gray-600">Loading chat history...</span>
                      </div>
                    </td>
                  </tr>
                ) : (showSelectedOnly
                    ? paginatedData.filter((chat) => selectedChats.includes(chat.id))
                    : paginatedData
                  ).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No chats found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {showSelectedOnly ? "No selected chats found" : "No chats found matching your criteria"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (showSelectedOnly
                    ? paginatedData.filter((chat) => selectedChats.includes(chat.id))
                    : paginatedData
                  ).map((chat, index) => {
                    const isItemSelected = isSelected(chat.id);
                    const selections = getSelections(chat);

                    return (
                      <tr
                        key={chat.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          isItemSelected ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isItemSelected}
                            onChange={(event) => handleCheckboxClick(event, chat.id)}
                            className="w-4 h-4 text-[#502DA6] border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {chat.name || 'Unknown User'}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {chat.number || 'No number'}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatDate(new Date(chat.timestamp))}
                        </td>

                        <td className="px-4 py-3">
                          <div className="space-y-1 max-w-xs">
                            {selections.cities.map((city, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full truncate max-w-full"
                              >
                                {index + 1}. {city}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="space-y-1 max-w-xs">
                            {selections.areas.map((area, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full truncate max-w-full"
                              >
                                {index + 1}. {area}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="space-y-1 max-w-xs">
                            {selections.categories.map((category, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full truncate max-w-full"
                              >
                                {index + 1}. {category}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {chat.children?.length > 0 ? (
                            <span className="text-sm text-gray-900">
                              {chat.children[chat.children.length - 1].user}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500 italic">No conversation</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewChatDetails(chat)}
                              className="p-2 text-[#502DA6] hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            <button
                              onClick={() => handleDelete(chat.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
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
                  onChange={(e) => handleChangeRowsPerPage(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Page {page + 1} of {Math.ceil(filteredData.length / rowsPerPage)}
                </span>
                <button
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 0}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
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

      <ChatDetailsModal
        open={chatDetailsModalOpen}
        onClose={() => setChatDetailsModalOpen(false)}
        chatData={selectedChatData}
        allChats={data}
      />
    </div>
  );
};

export default ChatBot_History;