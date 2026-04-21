import React from 'react';
import { 
  FaHeadset, 
  FaCut, 
  FaClipboardList, 
  FaBullhorn, 
  FaCog,
  FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Selectmode = () => {
  
  const menuOptions = [
    {
      id: 1,
      title: "Inquiry",
      icon: <FaHeadset className="text-2xl" />,
      description: "Manage customer inquiries, support tickets, and customer relationships with comprehensive tools",
      color: "from-blue-500 to-purple-600",
      query: "inquiry"
    },
    {
      id: 2,
      title: "Salon Section",
      icon: <FaCut className="text-2xl" />,
      description: "Complete salon management including staff, services, appointments, and operational oversight",
      color: "from-green-500 to-emerald-600",
      query: "salon"
    },
    {
      id: 3,
      title: "Request",
      icon: <FaClipboardList className="text-2xl" />,
      description: "Handle service requests, approvals, and manage workflow processes efficiently",
      color: "from-orange-500 to-red-500",
      query: "request"
    },
    {
      id: 4,
      title: "Marketing",
      icon: <FaBullhorn className="text-2xl" />,
      description: "Create and manage marketing campaigns, promotions, and customer engagement strategies",
      color: "from-pink-500 to-rose-600",
      query: "marketing"
    }
  ];

  const handleOptionClick = (query) => {
    console.log(`Selected: ${query}`);
  };

  return (
    <div className=" bg-gradient-to-br from-gray-50 to-gray-100 md:p-6 p-2">
    
      <div className="w-full  mx-auto">
        {/* Header Section */}
        
      <div className="flex items-start justify-between mb-12 relative">
  {/* Left Section */}
  <div>
    <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
      Management Console
    </h1>
    <p className="text-xl text-gray-600 max-w-4xl leading-relaxed">
      Select a module to access specialized management tools and features for your business operations
    </p>
  </div>

  {/* Right Section - Setting Icon */}
  <div className="flex flex-col items-center text-center">
    <Link to={`/?mode=setting`}>
      <div className="w-12 h-12 bg-[#512dc8] text-white rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-[#6245d9] transition">
        <FaCog className="text-2xl" />
      </div>
      <h3 className="text-sm font-bold  mt-2">Setting</h3>
    </Link>
  </div>
</div>



        {/* Options Grid - Now with 4 items only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {menuOptions.map((option) => (
            <div
              key={option.id}
              className="group flex flex-col h-full"
            >
              <div className="cursor-pointer bg-white rounded-xl shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full group-hover:border-[#502DA6]/20 group-hover:shadow-xl">
                {/* Icon Header with Gradient */}
                <div className={`bg-gradient-to-r ${option.color} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <FaArrowRight className="text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                      {option.icon}
                    </div>
                    <h3 className="text-xl font-bold">{option.title}</h3>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/10 rounded-full"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                    {option.description}
                  </p>

                  {/* ✅ Navigate to '/' with query parameter */}
                  <Link 
                    to={`/?mode=${option.query}`} 
                    className="w-full"  
                  >
                    <button 
                      onClick={() => handleOptionClick(option.query)}
                      className="w-full bg-gradient-to-r from-[#502DA6] to-purple-600 text-white py-3 px-4 rounded-md font-semibold hover:from-[#45248C] hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-3 group/btn"
                    >
                      <span>Access Panel</span>
                      <FaArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Status */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-8 py-4 shadow-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-semibold">All Systems Operational</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <span className="text-gray-500 text-sm">Last updated: Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selectmode;