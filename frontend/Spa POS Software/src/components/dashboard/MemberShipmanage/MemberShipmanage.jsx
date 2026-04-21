import React, { useState } from 'react';

const MemberShipmanage = () => {
  // Sample data for demonstration
 const initialMembers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    membershipType: 'Gold',
    joinDate: '2024-01-15',
    totalServices: 30,
    usedServices: 12,
    remainingServices: 18,
    services: [
      { name: 'Swedish Massage', date: '2024-01-20', time: '11:00 AM' },
      { name: 'Aroma Therapy', date: '2024-02-05', time: '04:30 PM' },
      { name: 'Steam Bath', date: '2024-02-10', time: '06:00 PM' },
      { name: 'Head Massage', date: '2024-02-15', time: '05:00 PM' }
    ]
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    membershipType: 'Platinum',
    joinDate: '2024-02-01',
    totalServices: 50,
    usedServices: 25,
    remainingServices: 25,
    services: [
      { name: 'Full Body Massage', date: '2024-02-02', time: '12:00 PM' },
      { name: 'Facial Treatment', date: '2024-02-10', time: '03:00 PM' },
      { name: 'Hot Stone Therapy', date: '2024-02-12', time: '06:30 PM' }
    ]
  },
  {
    id: 3,
    name: 'Amit Verma',
    email: 'amit.verma@gmail.com',
    membershipType: 'Silver',
    joinDate: '2024-01-10',
    totalServices: 20,
    usedServices: 5,
    remainingServices: 15,
    services: [
      { name: 'Back Massage', date: '2024-01-12', time: '07:00 PM' },
      { name: 'Foot Reflexology', date: '2024-01-18', time: '06:00 PM' }
    ]
  },
  {
    id: 4,
    name: 'Neha Singh',
    email: 'neha.singh@gmail.com',
    membershipType: 'Gold',
    joinDate: '2024-03-01',
    totalServices: 30,
    usedServices: 8,
    remainingServices: 22,
    services: [
      { name: 'Body Polishing', date: '2024-03-02', time: '01:00 PM' },
      { name: 'Aroma Massage', date: '2024-03-05', time: '05:30 PM' },
      { name: 'Steam Therapy', date: '2024-03-08', time: '06:30 PM' }
    ]
  },
  {
    id: 5,
    name: 'Vikram Mehta',
    email: 'vikram.mehta@gmail.com',
    membershipType: 'Platinum',
    joinDate: '2024-02-20',
    totalServices: 50,
    usedServices: 30,
    remainingServices: 20,
    services: [
      { name: 'Deep Tissue Massage', date: '2024-02-21', time: '10:00 AM' },
      { name: 'Couple Massage', date: '2024-02-22', time: '04:00 PM' },
      { name: 'Body Scrub', date: '2024-02-25', time: '01:00 PM' },
      { name: 'Ayurvedic Massage', date: '2024-02-28', time: '11:30 AM' },
      { name: 'Steam & Sauna', date: '2024-03-01', time: '06:00 PM' }
    ]
  }
];


  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'

  // Filter members based on search term
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate service usage percentage
  const calculateUsagePercentage = (used, total) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  // Handle view button click
  const handleViewMember = (member) => {
    setSelectedMember(member);
    setViewMode('details');
  };

  // Handle back to list
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto">
        
       

        {viewMode === 'list' ? (
          <>
            {/* Search Bar */}
            <div className="bg-white rounded-xl  p-4 mb-6 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-transparent transition-all duration-200"
                      placeholder="Search by name, email, or membership type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} found
                  </span>
                </div>
              </div>
            </div>

            {/* Members Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-xl -md hover:-lg transition-all duration-300 overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    {/* Member Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                        <p className="text-gray-600 text-sm">{member.email}</p>
                      </div>
                    
                    </div>

                    {/* Service Usage */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Service Usage</span>
                        <span className="text-sm font-semibold text-[#492DBD]">
                          {member.usedServices}/{member.totalServices} services
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-[#492DBD] to-[#492DBD] h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${calculateUsagePercentage(member.usedServices, member.totalServices)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">Used: {member.usedServices}</span>
                        <span className="text-xs text-gray-500">Remaining: {member.remainingServices}</span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">{member.services.length}</div>
                        <div className="text-xs text-gray-500">Recent Services</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">
                          {calculateUsagePercentage(member.usedServices, member.totalServices)}%
                        </div>
                        <div className="text-xs text-gray-500">Usage Rate</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleViewMember(member)}
                      className="w-full bg-gradient-to-r from-[#492DBD] to-[#492DBD] hover:from-[#492DBD] hover:to-[#492DBD] text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No members found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            )}
          </>
        ) : (
          /* Member Details View */
          selectedMember && (
            <div className="bg-white rounded-xl -lg overflow-hidden">
              {/* Back Button */}
              <div className="p-6 border-b border-gray-200">
                <button
                  onClick={handleBackToList}
                  className="flex items-center space-x-2 text-[#492DBD] hover:text-[#492DBD] font-medium transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Members List</span>
                </button>
              </div>

              {/* Member Header */}
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-indigo-50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedMember.name}</h2>
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-gray-600">{selectedMember.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-sm text-gray-500">Member since</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(selectedMember.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Service Usage Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl -sm border border-gray-200">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[#492DBD] mb-2">{selectedMember.usedServices}</div>
                      <div className="text-gray-600 font-medium">Services Used</div>
                      <div className="text-sm text-gray-500">Out of {selectedMember.totalServices} total</div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl -sm border border-gray-200">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">{selectedMember.remainingServices}</div>
                      <div className="text-gray-600 font-medium">Services Remaining</div>
                      <div className="text-sm text-gray-500">Available for use</div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl -sm border border-gray-200">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {calculateUsagePercentage(selectedMember.usedServices, selectedMember.totalServices)}%
                      </div>
                      <div className="text-gray-600 font-medium">Usage Rate</div>
                      <div className="text-sm text-gray-500">Service utilization</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service History */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-[#492DBD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Service Usage History
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Service Name</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedMember.services.map((service, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-[#492DBD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="font-medium text-gray-800">{service.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-700">{service.date}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-700">{service.time}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              Used
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Service Usage Summary */}
                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Service Usage Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 mb-2">
                        This member has used <span className="font-bold text-[#492DBD]">{selectedMember.usedServices} out of {selectedMember.totalServices}</span> services in their membership plan.
                      </p>
                      <p className="text-gray-600">
                        They still have <span className="font-bold text-green-600">{selectedMember.remainingServices} services</span> available for use.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${calculateUsagePercentage(selectedMember.usedServices, selectedMember.totalServices)}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">
                              {calculateUsagePercentage(selectedMember.usedServices, selectedMember.totalServices)}%
                            </div>
                            <div className="text-sm text-gray-500">Used</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MemberShipmanage;