import React, { useState, useEffect, useContext } from "react";
import { 
  HiOutlineBuildingOffice2, 
  HiOutlineUser, 
  HiOutlineScissors, 
  HiOutlineMapPin, 
  HiOutlineCurrencyRupee, 
  HiOutlineCalendarDays, 
  HiOutlinePhone, 
  HiOutlineChatBubbleLeftRight,
  HiXMark,
} from 'react-icons/hi2';

import { FolderUp } from "lucide-react";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import DateRange from "./DateRange/CustomDateRange";
import { formatDate } from "./DateRange/formatDate";
import InquiriesLeadsForm from "./Forms/InquiriesLeadsForm";
import { useNavigate } from "react-router-dom";

// CSV Upload Modal Component
const CSVUploadModal = ({ open, onClose, onUploadSuccess }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showFormat, setShowFormat] = useState(false);

  if (!open) return null;

  // Format data
  const formatFields = [
    "Date",
    "MobileNumber", 
    "FromWhereLeadsHadCome",
    "CampaignName",
    "InterestedSalon",
    "InterestedArea",
    "InterestedCity",
    "InterestedService",
    "CustomerName",
    "TrakkyOfferedSalon", 
    "Gender",
    "StatusOfBooking",
    "CustomerBookedSalon",
    "BookedSalonArea",
    "AppointmentDate",
    "ForHowManyPerson",
    "BookedService1",
    "BookedService2", 
    "BookedService3",
    "TotalPriceOfTheBooking",
    "ConvertedDate",
    "WhereChatStopped",
    "CalledForBooking (Yes/No)",
    "Remarks",
    "CustomerType (Yes/No)"
  ];

  // CSV Format Download Function
  const downloadCSVFormat = () => {
    // Create CSV headers
    const headers = formatFields.join(',');
    
    // Create sample data row with empty values
    const sampleData = formatFields.map(field => {
      if (field.includes('(Yes/No)')) return 'Yes';
      if (field.includes('Date')) return '2024-01-01';
      if (field.includes('MobileNumber')) return '9876543210';
      if (field.includes('TotalPriceOfTheBooking')) return '1000';
      if (field.includes('ForHowManyPerson')) return '2';
      return 'Sample Data';
    }).join(',');

    // Create CSV content
    const csvContent = `${headers}\n${sampleData}`;
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'customer_sample_csv_format.csv');
    link.style.visibility = 'hidden'; 
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV format downloaded successfully!');
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
        toast.error('Please select a valid CSV file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('csv_file', selectedFile);

    try {
      const response = await fetch('https://backendapi.trakky.in/salons/upload-inquiry-leads-csv/', {
        method: 'POST',
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: formData,
      });

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) { 
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      if (response.ok) {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        const data = await response.json();
        toast.success(`Successfully uploaded ${data.uploaded_count || 0} leads from CSV`);
        
        setSelectedFile(null);
        setUploadProgress(0);
        
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast.error(error.message || 'Failed to upload CSV file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-[#502DA6]', 'bg-indigo-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#502DA6]', 'bg-indigo-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#502DA6]', 'bg-indigo-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
        toast.error('Please drop a valid CSV file');
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <>
      {/* Main Upload Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="w-full h-auto max-w-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <FolderUp className="w-8 h-8 text-[#502DA6]" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Upload CSV File</h2>
                <p className="text-gray-600 mt-1">Upload inquiry leads from CSV file</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isUploading}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Format Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowFormat(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-[#502DA6] border border-[#502DA6] rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Required Format
              </button>
            </div>

            {/* File Drop Zone */}
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all duration-200 ${
                selectedFile ? 'border-green-500 bg-green-50' : 'hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <FolderUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                    disabled={isUploading}
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <FolderUp className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Drop your CSV file here</p>
                    <p className="text-gray-500 mt-1">or click to browse</p>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="csv-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="csv-upload"
                    className="inline-flex items-center px-6 py-3 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <FolderUp className="w-5 h-5 mr-2" />
                    Browse Files
                  </label>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports: .csv files only
                  </p>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#502DA6] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="px-6 py-2 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FolderUp className="w-4 h-4 mr-2" />
                  Upload CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Format Modal */}
      {showFormat && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-4xl max-h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-[#502DA6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">CSV File Format</h2>
                  <p className="text-gray-600 mt-1">Required columns for successful upload</p>
                </div>
              </div>
              <button
                onClick={() => setShowFormat(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Column Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formatFields.map((field, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {field}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {field.includes('(Yes/No)') 
                            ? 'Boolean field - Use "Yes" or "No"'
                            : field.includes('Date')
                            ? 'Date field - Use YYYY-MM-DD format'
                            : field.includes('MobileNumber')
                            ? '10-digit mobile number'
                            : 'Text field'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure your CSV file contains these exact column names</li>
                  <li>• Column names are case-sensitive</li>
                  <li>• MobileNumber and CustomerName are required fields</li>
                  <li>• Date fields should be in YYYY-MM-DD format</li>
                  <li>• Yes/No fields should contain only "Yes" or "No"</li>
                </ul>
              </div>

              {/* Download CSV Format Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={downloadCSVFormat}
                  className="flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CSV Format Template
                </button>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowFormat(false)}
                className="px-6 py-2 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


const InquiryHistoryModal = ({ open, onClose, mobileNumber, inquiries }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Inquiry History</h2>
            <p className="text-gray-600 mt-1">Mobile: {mobileNumber}</p>
            <p className="text-sm text-gray-500">Total Inquiries: {inquiries.length}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {inquiries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">No inquiry history found for this number</p>
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiry Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">{inquiry.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{inquiry.inquiry_date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{inquiry.salon_info?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {inquiry.multiple_services
                          ? Object.values(inquiry.multiple_services).join(", ")
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inquiry.choice === "converted"
                            ? "bg-green-100 text-green-800"
                            : inquiry.choice === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {inquiry.choice}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{inquiry.source_of_lead || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
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

const InquiryDetailsModal = ({ open, onClose, lead }) => {
  if (!open || !lead) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-800">
            Inquiry Details — <span className="font-mono text-[#502DA6]">ID: {lead.id}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Salon Details */}
            <div className="space-y-3">
              <h3 className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <HiOutlineBuildingOffice2 className="w-4 h-4 mr-2 text-[#502DA6]" />
                Salon Details
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Name</span>
                  <span className="text-gray-900">{lead.salon_info?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">City</span>
                  <span className="text-gray-900">{lead.salon_info?.city || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Area</span>
                  <span className="text-gray-900">{lead.salon_info?.area || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-3">
              <h3 className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <HiOutlineUser className="w-4 h-4 mr-2 text-[#502DA6]" />
                Customer Information
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Name</span>
                  <span className="text-gray-900">{lead.customer_name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Mobile</span>
                  <span className="text-gray-900">{lead.customer_mobile_number || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Gender</span>
                  <span className="text-gray-900">{lead.gender || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-3">
              <h3 className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <HiOutlineScissors className="w-4 h-4 mr-2 text-[#502DA6]" />
                Services
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]">
                {lead.multiple_services && Object.values(lead.multiple_services).length > 0 ? (
                  <ul className="space-y-2">
                    {Object.values(lead.multiple_services).map((service, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                        {service}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No services specified</p>
                )}
              </div>
            </div>

            {/* Interested Areas */}
            <div className="space-y-3">
              <h3 className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <HiOutlineMapPin className="w-4 h-4 mr-2 text-[#502DA6]" />
                Interested Areas
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]">
                {lead.additional_areas && lead.additional_areas.length > 0 ? (
                  <ul className="space-y-2">
                    {lead.additional_areas.map((area, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                        {area}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No areas specified</p>
                )}
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-3">
              <h3 className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <HiOutlineCurrencyRupee className="w-4 h-4 mr-2 text-[#502DA6]" />
                Financial Details
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Price Told</span>
                  <span className="text-gray-900">{lead.price_told ? `₹${lead.price_told}` : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Source</span>
                  <span className="text-gray-900">{lead.source_of_lead || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Campaign</span>
                  <span className="text-gray-900">{lead.campaign_name || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Status & Dates */}
            <div className="space-y-3">
              <h3 className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <HiOutlineCalendarDays className="w-4 h-4 mr-2 text-[#502DA6]" />
                Status & Dates
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Inquiry Date</span>
                  <span className="text-gray-900">{lead.inquiry_date ? formatDate(lead.inquiry_date) : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Created At</span>
                  <span className="text-gray-900">{lead.created_at ? formatDate(lead.created_at) : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Last Status</span>
                  <span className="text-gray-900">{lead.last_conversation_status || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Called for Booking</span>
                  <span className={`font-medium ${lead.does_called_for_booking ? 'text-green-600' : 'text-red-600'}`}>
                    {lead.does_called_for_booking ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Sections */}
          <div className="mt-8 space-y-6">
            {/* Calling History */}
            <div className="space-y-3">
              <h3 className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <HiOutlinePhone className="w-4 h-4 mr-2 text-[#502DA6]" />
                Calling History
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                {lead.calling_history?.length > 0 ? (
                  <div className="space-y-3">
                    {lead.calling_history.map((call, index) => (
                      <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-3 last:border-0">
                        <div>
                          <p className="font-medium text-gray-800">{call.date} at {call.time}</p>
                          <p className="text-gray-600 text-sm mt-1">{call.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No calling history</p>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-3">
              <h3 className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <HiOutlineChatBubbleLeftRight className="w-4 h-4 mr-2 text-[#502DA6]" />
                Remarks
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[80px]">
                {lead.remarks && Object.values(lead.remarks).length > 0 ? (
                  <ul className="space-y-2">
                    {Object.values(lead.remarks).map((remark, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></span>
                        <span>{remark}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No remarks</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
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

const ConversionModal = ({ open, onClose, lead, onSubmit }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    salon: lead?.salon_info
      ? {
          value: lead.salon_info.id,
          label: lead.salon_info.name,
        }
      : null,
    masterservice: lead?.masterservice_info?.map((service) => service.id) || [],
    gender: lead?.gender || "",
    converted_date: new Date().toISOString().split("T")[0],
    appointment_date: "",
    customer_name: lead?.customer_name || "",
    customer_mobile_number: lead?.customer_mobile_number || "",
    price: "",
    source_of_lead: lead?.source_of_lead || "",
    ad_spend: lead?.ad_spend || null,
    campaign_name: lead?.campaign_name || "",
    does_customer_visited_the_salon: false,
    reason_for_not_visited_the_salon: "",
    number_of_customers: 1,
    remarks: Object.values(lead?.remarks || {}).join("\n") || "",
  });
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const [masterServices, setMasterServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryServices, setCategoryServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nextPage, setNextPage] = useState(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-800">Convert Lead to Customer</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form fields would go here - maintaining the same structure as original */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Details
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={formData.customer_mobile_number}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Add other form fields similarly */}

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={detailsConfirmed}
                  onChange={(e) => setDetailsConfirmed(e.target.checked)}
                  className="w-4 h-4 text-[#502DA6] border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  I confirm all details are proper for converting this lead
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            disabled={!detailsConfirmed}
            className="px-6 py-2 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Convert Lead
          </button>
        </div>
      </div>
    </div>
  );
};

const InquiryLeads = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dateFilterType, setDateFilterType] = useState("none");
  const [inquiryLeads, setInquiryLeads] = useState([]);
  const [filteredInquiryLeads, setFilteredInquiryLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [dateState, setDateState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [searchOption, setSearchOption] = useState("phone");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [conversionLead, setConversionLead] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  });
  const [csvUploadModalOpen, setCsvUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  const [inquiryHistoryModal, setInquiryHistoryModal] = useState({
    open: false,
    mobileNumber: "",
    inquiries: [],
  });

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDetailLead, setSelectedDetailLead] = useState(null);

  // Get unique inquiries based on mobile number
  const getUniqueInquiries = (inquiries) => {
    const uniqueMap = new Map();
    const sortedInquiries = [...inquiries].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    sortedInquiries.forEach((inquiry) => {
      const mobile = inquiry.customer_mobile_number;
      if (!uniqueMap.has(mobile)) {
        uniqueMap.set(mobile, inquiry);
      }
    });
    return Array.from(uniqueMap.values());
  };

  const getUniqueInquiriesCount = (inquiries) => {
    const uniqueMobiles = new Set(
      inquiries.map((inquiry) => inquiry.customer_mobile_number)
    );
    return uniqueMobiles.size;
  };

  const fetchInquiryHistory = async (mobileNumber) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/inquiryleads/?customer_mobile_number=${mobileNumber}`,
        {
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setInquiryHistoryModal({
          open: true,
          mobileNumber: mobileNumber,
          inquiries: data.results || [],
        });
      }
    } catch (error) {
      console.error("Error fetching inquiry history:", error);
      toast.error("Failed to fetch inquiry history");
    }
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "converted", label: "Converted" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ];

  const getLatestInquiries = async (pageUrl = null) => {
    setLoading(true);
    try {
      const baseUrl = "https://backendapi.trakky.in/salons/inquiryleads/";
      const url = pageUrl
        ? `${pageUrl}&ordering=-created_at`
        : `${baseUrl}?ordering=-created_at`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setInquiryLeads(data.results);
        const uniqueResults = getUniqueInquiries(data.results);
        setFilteredInquiryLeads(uniqueResults);
        setPagination({
          count: getUniqueInquiriesCount(data.results),
          next: data.next,
          previous: data.previous,
          currentPage: pageUrl
            ? parseInt(new URL(pageUrl).searchParams.get("page")) || 1
            : 1,
        });
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching latest inquiries:", error);
      toast.error("Failed to fetch latest inquiries. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = (type) => {
    setDateFilterType(type);
    if (type === "latest") {
      getLatestInquiries();
      return;
    }
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    switch (type) {
      case "today":
        break;
      case "last3":
        startDate.setDate(today.getDate() - 3);
        break;
      case "last7":
        startDate.setDate(today.getDate() - 7);
        break;
      case "last15":
        startDate.setDate(today.getDate() - 15);
        break;
      case "last30":
        startDate.setDate(today.getDate() - 30);
        break;
      case "last45":
        startDate.setDate(today.getDate() - 45);
        break;
      case "last60":
        startDate.setDate(today.getDate() - 60);
        break;
      case "last90":
        startDate.setDate(today.getDate() - 90);
        break;
      case "custom":
        setShowDateSelectionModal(true);
        return;
      case "none":
      default:
        getInquiryLeads();
        return;
    }
    if (type !== "custom" && type !== "none") {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      setDateState([{ startDate, endDate, key: "selection" }]);
      fetchInquiryLeadsWithDateFilter(formattedStartDate, formattedEndDate);
    }
  };

  useEffect(() => {
    handleDateFilterChange("today");
  }, []);

  const handleConvertClick = (lead) => {
    setConversionLead(lead);
    setConversionModalOpen(true);
  };

  const handleConvertClose = () => {
    setConversionModalOpen(false);
    setConversionLead(null);
  };

  const handleConvertSubmit = async (formData) => {
    try {
      const inquiryResponse = await fetch(
        `https://backendapi.trakky.in/salons/inquiryleads/${conversionLead.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            choice: "converted",
            last_conversation_status: "Converted",
          }),
        }
      );
      if (inquiryResponse.status === 200) {
        const convertedResponse = await fetch(
          "https://backendapi.trakky.in/salons/convertedleads/",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              salon: formData.salon.value,
              masterservice: formData.masterservice,
              gender: formData.gender,
              converted_date: formData.converted_date,
              appointment_date: formData.appointment_date,
              customer_name: formData.customer_name,
              customer_mobile_number: formData.customer_mobile_number,
              price: formData.price,
              source_of_lead: formData.source_of_lead,
              ad_spend: formData.ad_spend,
              campaign_name: formData.campaign_name,
              does_customer_visited_the_salon:
                formData.does_customer_visited_the_salon,
              reason_for_not_visited_the_salon:
                formData.reason_for_not_visited_the_salon,
              number_of_customers: formData.number_of_customers,
              remarks: formData.remarks,
            }),
          }
        );
        if (convertedResponse.status === 201) {
          toast.success("Lead converted successfully!");
          getInquiryLeads();
          handleConvertClose();
        } else {
          throw new Error("Failed to create converted lead");
        }
      } else {
        throw new Error("Failed to update inquiry status");
      }
    } catch (error) {
      console.error("Error converting lead:", error);
      toast.error("Failed to convert lead. Please try again later");
    }
  };

  const fetchInquiryLeadsWithDateFilter = async (startDate, endDate) => {
    setLoading(true);
    try {
      const url = `https://backendapi.trakky.in/salons/inquiryleads/?inquiry_date_from=${startDate}&inquiry_date_to=${endDate}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setInquiryLeads(data.results);
        const uniqueResults = getUniqueInquiries(data.results);
        setFilteredInquiryLeads(uniqueResults);
        setPagination({
          count: getUniqueInquiriesCount(data.results),
          next: data.next,
          previous: data.previous,
          currentPage: 1,
        });
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching inquiry leads:", error);
      toast.error("Failed to fetch inquiry leads. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const searchOptions = [
    { value: "phone", label: "Phone" },
    { value: "salon", label: "Salon Name" },
    { value: "city", label: "City" },
    { value: "area", label: "Area" },
  ];

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedLeads.map((lead) => lead.id);
      setSelectedLeads(newSelected);
      return;
    }
    setSelectedLeads([]);
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selectedLeads.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedLeads, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedLeads.slice(1));
    } else if (selectedIndex === selectedLeads.length - 1) {
      newSelected = newSelected.concat(selectedLeads.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedLeads.slice(0, selectedIndex),
        selectedLeads.slice(selectedIndex + 1)
      );
    }
    setSelectedLeads(newSelected);
  };

  const isSelected = (id) => selectedLeads.indexOf(id) !== -1;

  const clearSelection = () => {
    setSelectedLeads([]);
  };

  const getStatistics = () => {
    const total = getUniqueInquiriesCount(inquiryLeads);
    return { total };
  };

  const stats = getStatistics();

  const handleEditClick = (lead) => {
    setCurrentLead(lead);
    setEditModalOpen(true);
  };

  const handleEditSuccess = (updatedLead) => {
    setInquiryLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
    );
    setEditModalOpen(false);
    toast.success("Lead updated successfully");
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
  };

  const getRowColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50";
      case "rejected":
        return "bg-red-50";
      case "converted":
        return "bg-green-50";
      default:
        return "bg-white";
    }
  };

  const getInquiryLeads = async (pageUrl = null) => {
    setLoading(true);
    try {
      const url = pageUrl || `https://backendapi.trakky.in/salons/inquiryleads/`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setInquiryLeads(data.results);
        const uniqueResults = getUniqueInquiries(data.results);
        setFilteredInquiryLeads(uniqueResults);
        setPagination({
          count: getUniqueInquiriesCount(data.results),
          next: data.next,
          previous: data.previous,
          currentPage: pageUrl
            ? parseInt(new URL(pageUrl).searchParams.get("page")) || 1
            : 1,
        });
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching inquiry leads:", error);
      toast.error("Failed to fetch inquiry leads. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const deleteInquiryLead = async (leadId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/inquiryleads/${leadId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      if (response.status === 204) {
        setInquiryLeads((prev) => prev.filter((p) => p.id !== leadId));
        setFilteredInquiryLeads((prev) => prev.filter((p) => p.id !== leadId));
        toast.success("Lead deleted successfully!");
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead. Please try again later");
    }
  };

  const deleteSelectedLeads = async () => {
    if (selectedLeads.length === 0) {
      toast.error("No leads selected");
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedLeads.length} selected leads?`
    );
    if (!confirmDelete) return;
    try {
      const deletePromises = selectedLeads.map((id) =>
        fetch(`https://backendapi.trakky.in/salons/inquiryleads/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        })
      );
      const results = await Promise.all(deletePromises);
      const allSuccess = results.every((res) => res.status === 204);
      if (allSuccess) {
        setInquiryLeads((prev) =>
          prev.filter((p) => !selectedLeads.includes(p.id))
        );
        setFilteredInquiryLeads((prev) =>
          prev.filter((p) => !selectedLeads.includes(p.id))
        );
        setSelectedLeads([]);
        toast.success(`Deleted ${selectedLeads.length} leads successfully!`);
      } else {
        throw new Error("Some deletions failed");
      }
    } catch (error) {
      toast.error("Error deleting some leads");
    }
  };

  const handleSearch = () => {
    let filtered = [...inquiryLeads];
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((lead) => {
        const searchValue = searchTerm.toLowerCase();
        switch (searchOption) {
          case "phone":
            return lead.customer_mobile_number?.includes(searchValue);
          case "city":
            return lead.salon_info?.city?.toLowerCase().includes(searchValue);
          case "area":
            return lead.salon_info?.area?.toLowerCase().includes(searchValue);
          case "salon":
            return lead.salon_info?.name?.toLowerCase().includes(searchValue);
          default:
            return true;
        }
      });
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.choice === statusFilter);
    }
    const uniqueFiltered = getUniqueInquiries(filtered);
    setFilteredInquiryLeads(uniqueFiltered);
    setPage(0);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, statusFilter, inquiryLeads]);

  const handleChangePage = (event, newPage) => {
    const currentPageIndex = page;
    const newPageIndex = newPage;
    const rowsPerPageIndex = rowsPerPage;
    if ((newPageIndex + 1) * rowsPerPageIndex > inquiryLeads.length) {
      if (pagination.next) {
        if (dateFilterType === "latest") {
          getLatestInquiries(pagination.next);
        } else {
          getInquiryLeads(pagination.next);
        }
      }
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    if (
      newRowsPerPage > rowsPerPage &&
      inquiryLeads.length < pagination.count
    ) {
      getInquiryLeads();
    }
  };

  const displayedLeads = showSelectedOnly
    ? filteredInquiryLeads.filter((lead) => selectedLeads.includes(lead.id))
    : filteredInquiryLeads;

  const paginatedLeads = displayedLeads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDetailsClick = (lead) => {
    setSelectedDetailLead(lead);
    setDetailsModalOpen(true);
  };

  const isSelectionMode = selectedLeads.length > 0;

  const handleCsvUploadSuccess = () => {
    // Refresh the leads data after successful upload
    getInquiryLeads();
  };

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

     {/* Header Card */}
<div className="mx-auto px-3 sm:px-4 mb-4 sm:mb-6">
  <div className="bg-gradient-to-r from-[#502DA6] to-indigo-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 lg:p-8 text-white">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
      
      {/* Left Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
            Inquiry Leads
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 opacity-90">
            Manage and monitor your salon inquiry leads
          </p>
        </div>
        
        {isSelectionMode && (
          <span className="inline-flex items-center self-start sm:self-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-500 text-white text-xs sm:text-sm font-medium whitespace-nowrap">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1.5 sm:mr-2"></span>
            {selectedLeads.length} Selected
          </span>
        )}
      </div>

      {/* Right Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        {/* Total Inquiries */}
        <div className="w-full sm:w-auto text-left sm:text-right order-2 sm:order-1">
          <p className="text-indigo-200 text-xs sm:text-sm font-medium uppercase tracking-wide">
            Total Inquiries
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {stats.total}
          </p>
        </div>

        {/* CSV Upload Button */}
        <button
          onClick={() => setCsvUploadModalOpen(true)}
          className="inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-sm text-sm sm:text-base order-1 sm:order-2"
        >
          <FolderUp className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
          <span>Upload CSV</span>
        </button>
      </div>

    </div>
  </div>
</div>

      {/* Filters Card */}
      <div className=" mx-auto px-4  mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-3">
              <select
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {searchOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "today", label: "Today" },
              { key: "last3", label: "Last 3 Days" },
              { key: "last7", label: "Last 7 Days" },
              { key: "last15", label: "Last 15 Days" },
              { key: "last30", label: "Last 30 Days" },
              { key: "last45", label: "Last 45 Days" },
              { key: "last60", label: "Last 60 Days" },
              { key: "last90", label: "Last 90 Days" },
              { key: "custom", label: "Custom Range" },
              { key: "latest", label: "Latest Inquiries" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleDateFilterChange(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateFilterType === filter.key
                    ? "bg-[#502DA6] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
            <button
              onClick={() => handleDateFilterChange("none")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              Clear Date Filter
            </button>
          </div>
        </div>
      </div>

      {/* Selected Leads Bar */}
      {isSelectionMode && (
        <div className=" mx-auto px-4  mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {selectedLeads.length} leads selected
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
                  onClick={deleteSelectedLeads}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
              <button
                onClick={clearSelection}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className=" mx-auto px-4 ">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={paginatedLeads.length > 0 && selectedLeads.length === paginatedLeads.length}
                      onChange={handleSelectAllClick}
                      className="w-4 h-4 text-[#502DA6] border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salon Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Mobile</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiry Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#502DA6]"></div>
                        <span className="text-gray-600">Loading leads...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <div className="text-gray-500 text-lg">
                        {showSelectedOnly
                          ? "No selected leads found"
                          : "No leads found matching your criteria"}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead, index) => {
                    const isItemSelected = isSelected(lead.id);
                    return (
                      <tr
                        key={lead.id}
                        className={`${getRowColor(lead.choice)} hover:bg-gray-50 transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isItemSelected}
                            onChange={(event) => handleCheckboxClick(event, lead.id)}
                            className="w-4 h-4 text-[#502DA6] border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {page * rowsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.salon_info?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.salon_info
                                ? `${lead.salon_info.city || ""}, ${lead.salon_info.area || ""}`
                                : "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex items-center">
                            <HiOutlineUser className="w-4 h-4 mr-2 text-gray-400" />
                            {lead.customer_name || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex items-center">
                            <HiOutlinePhone className="w-4 h-4 mr-2 text-gray-400" />
                            {lead.customer_mobile_number || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {lead.inquiry_date
                            ? formatDate(new Date(lead.inquiry_date))
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-900">
                              {lead.last_conversation_status || "N/A"}
                            </span>
                            {lead.last_conversation_status !== "converted" && (
                              <button
                                onClick={() => handleConvertClick(lead)}
                                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                                title="Convert Lead"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDetailsClick(lead)}
                            className="p-2 text-[#502DA6] hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <button
  onClick={() => handleEditClick(lead)}
  className="p-2 text-[#502DA6] hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
  title="Edit Lead"
>
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
</button>

                            <button
                              onClick={() => deleteInquiryLead(lead.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Lead"
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
                <span className="text-sm text-gray-700">
                  Show
                </span>
                <select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[50, 100, 500, 1000].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">
                  entries
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Page {page + 1} of {Math.ceil(filteredInquiryLeads.length / rowsPerPage)}
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
                  disabled={page >= Math.ceil(filteredInquiryLeads.length / rowsPerPage) - 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Upload Modal */}
      <CSVUploadModal
        open={csvUploadModalOpen}
        onClose={() => setCsvUploadModalOpen(false)}
        onUploadSuccess={handleCsvUploadSuccess}
      />

      {/* Modals */}
      {showDateSelectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Select Date Range</h3>
              <button
                onClick={() => setShowDateSelectionModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <DateRange
                dateState={dateState}
                setDateState={setDateState}
                setShowDateSelectionModal={setShowDateSelectionModal}
              />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDateSelectionModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const formattedStartDate = formatDate(dateState[0].startDate);
                  const formattedEndDate = formatDate(dateState[0].endDate);
                  fetchInquiryLeadsWithDateFilter(formattedStartDate, formattedEndDate);
                  setShowDateSelectionModal(false);
                  setDateFilterType("custom");
                }}
                className="px-6 py-2 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && currentLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Edit Inquiry/Lead</h3>
              <button
                onClick={handleEditClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <InquiriesLeadsForm
                leadData={currentLead}
                onSuccess={handleEditSuccess}
                onCancel={handleEditClose}
                isEditMode={true}
              />
            </div>
          </div>
        </div>
      )}

      <InquiryHistoryModal
        open={inquiryHistoryModal.open}
        onClose={() =>
          setInquiryHistoryModal({
            open: false,
            mobileNumber: "",
            inquiries: [],
          })
        }
        mobileNumber={inquiryHistoryModal.mobileNumber}
        inquiries={inquiryHistoryModal.inquiries}
      />

      <ConversionModal
        open={conversionModalOpen}
        onClose={handleConvertClose}
        lead={conversionLead}
        onSubmit={handleConvertSubmit}
      />

      <InquiryDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        lead={selectedDetailLead}
      />
    </div>
  );
};

export default InquiryLeads;