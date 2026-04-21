import React, { useState, useEffect, useContext } from 'react';
import { Clock, Info, Save, CheckCircle } from 'lucide-react';
import AuthContext from "../Context/Auth";
import { toast, Toaster } from "react-hot-toast";

const WhatsappMessageReminder = () => {
    const { authTokens, vendorData, setVendorData } = useContext(AuthContext);
    const [selectedTimings, setSelectedTimings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    // Available reminder timings with descriptions
    const reminderOptions = [
        { id: '48h', label: '48 hours before', apiField: 'Whatsapp_reminder_48_hrs', description: 'Send reminder 48 hours before appointment' },
        { id: '24h', label: '24 hours before', apiField: 'Whatsapp_reminder_24_hrs', description: 'Send reminder 24 hours before appointment' },
        { id: '2h', label: '2 hours before', apiField: 'Whatsapp_reminder_2_hrs', description: 'Send reminder 2 hours before appointment' },
        { id: '30m', label: '30 minutes before', apiField: 'Whatsapp_reminder_30_min', description: 'Send reminder 30 minutes before appointment' },
    ];

    // Load saved preferences from vendorData on component mount
    useEffect(() => {
        if (vendorData) {
            const timings = reminderOptions
                .filter(option => vendorData[option.apiField])
                .map(option => option.id);
            setSelectedTimings(timings);
        }
    }, [vendorData]);

    const handleTimingChange = (timingId) => {
        setSelectedTimings(prev => {
            if (prev.includes(timingId)) {
                return prev.filter(id => id !== timingId);
            } else {
                return [...prev, timingId];
            }
        });
        setSaved(false);
    };

    
  let branchId = localStorage.getItem("branchId") || "";

    const savePreferences = async () => {
         if (!navigator.onLine) {
                  toast.error("No Internet Connection");
                  return;
                }
        if (!vendorData?.id) {
            toast.error("Vendor data not available");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                Whatsapp_reminder_48_hrs: selectedTimings.includes('48h'),
                Whatsapp_reminder_24_hrs: selectedTimings.includes('24h'),
                Whatsapp_reminder_2_hrs: selectedTimings.includes('2h'),
                Whatsapp_reminder_30_min: selectedTimings.includes('30m'),
                // branchId: branchId
            };

            const response = await fetch(
                `https://backendapi.trakky.in/salonvendor/vendor-pos/${vendorData.id}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authTokens?.access_token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                const updatedData = await response.json();
                setVendorData(updatedData);
                toast.success("Reminder preferences saved successfully!");
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                throw new Error("Failed to save reminder preferences");
            }
        } catch (error) {
            toast.error("Error saving reminder preferences");
            console.error("Error saving reminders:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 ">
            <Toaster />
            <div className="mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">WhatsApp Reminder Setting's</h1>
                            <p className="text-sm text-gray-500">Configure automatic appointment reminders</p>
                        </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start space-x-3">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-medium text-blue-800 mb-1">How It Works</h3>
                                <p className="text-sm text-blue-700">
                                    When a customer books an appointment, our system will automatically send WhatsApp reminders
                                    at the selected intervals before their appointment time. For example, if you select "24 hours before"
                                    and "2 hours before", reminders will be sent at both of these times.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Select Reminder Timings</h2>
                    
                    <div className="space-y-3">
                        {reminderOptions.map(option => (
                            <div
                                key={option.id}
                                className={`
                                    flex items-center justify-between p-4 border rounded-lg transition-all cursor-pointer
                                    ${selectedTimings.includes(option.id)
                                        ? 'border-[#492DBD] bg-[#492DBD] bg-opacity-5'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }
                                `}
                                onClick={() => handleTimingChange(option.id)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`
                                        w-5 h-5 border rounded flex items-center justify-center transition-colors
                                        ${selectedTimings.includes(option.id)
                                            ? 'border-[#492DBD] bg-[#492DBD]'
                                            : 'border-gray-300'
                                        }
                                    `}>
                                        {selectedTimings.includes(option.id) && (
                                            <CheckCircle className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{option.label}</div>
                                        <div className="text-sm text-gray-500">{option.description}</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <div className="text-sm text-gray-400 group relative">
                                        <Info className="w-4 h-4" />
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded py-2 px-3 z-10">
                                            {option.description}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={savePreferences}
                            disabled={loading}
                            className={`
                                w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all
                                ${loading || saved
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#492DBD] text-white hover:bg-[#3a2199]'
                                }
                            `}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Saving Preferences...</span>
                                </>
                            ) : saved ? (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Preferences Saved!</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Save Preferences</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Selection Summary */}
                    {selectedTimings.length > 0 && (
                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-2 text-green-800">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {selectedTimings.length} reminder{selectedTimings.length !== 1 ? 's' : ''} selected
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-green-700">
                                Reminders will be sent: {selectedTimings.map(id => 
                                    reminderOptions.find(opt => opt.id === id)?.label
                                ).join(', ')}
                            </div>
                        </div>
                    )}

                    {selectedTimings.length === 0 && (
                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center space-x-2 text-yellow-800">
                                <Info className="w-4 h-4" />
                                <span className="text-sm font-medium">No reminders selected</span>
                            </div>
                            <div className="mt-1 text-sm text-yellow-700">
                                Select at least one timing to enable WhatsApp reminders
                            </div>
                        </div>
                    )}
                </div>

                {/* Benefits Section */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits of WhatsApp Reminders</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#492DBD] rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <div className="font-medium text-gray-900">Reduce No-Shows</div>
                                <div className="text-sm text-gray-600">Automated reminders help customers remember their appointments</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#492DBD] rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <div className="font-medium text-gray-900">Better Customer Experience</div>
                                <div className="text-sm text-gray-600">Keep your customers informed and engaged</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#492DBD] rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <div className="font-medium text-gray-900">Optimized Staff Time</div>
                                <div className="text-sm text-gray-600">Reduce time spent on manual reminder calls</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#492DBD] rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <div className="font-medium text-gray-900">Increased Revenue</div>
                                <div className="text-sm text-gray-600">Fewer missed appointments mean more consistent revenue</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsappMessageReminder;