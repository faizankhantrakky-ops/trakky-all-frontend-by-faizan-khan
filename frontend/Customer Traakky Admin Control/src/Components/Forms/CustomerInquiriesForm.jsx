import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import { FaTimes } from "react-icons/fa";
import "quill/dist/quill.snow.css";

const CustomerInquiriesForm = ({ inquiryData, onSuccess, onCancel }) => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [selectedCity, setSelectedCity] = useState("");
    const [city, setCity] = useState([]);
    const [selectedSalons, setSelectedSalons] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        campaign_name: "",
        client_image: null,
        video: null,
        duration_of_campaign: "",
        starting_date: "",
        expire_date: "",
        caption: "",
        hashtags: "",
        budget_have: "",
        budget_spend: "",
        total_booking: "",
        total_inqiry: ""
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const navigate = useNavigate();

    const handleBackToList = () => {
        navigate("/CustomerInquires");
    };

    // Initialize form with inquiryData if provided (for editing)
    useEffect(() => {
        if (inquiryData) {
            setFormData({
                campaign_name: inquiryData.campaign_name || "",
                client_image: inquiryData.client_image || null,
                video: inquiryData.video || null,
                duration_of_campaign: inquiryData.duration_of_campaign || "",
                starting_date: inquiryData.starting_date || "",
                expire_date: inquiryData.expire_date || "",
                caption: inquiryData.caption || "",
                hashtags: inquiryData.hashtags || "",
                budget_have: inquiryData.budget_have || "",
                budget_spend: inquiryData.budget_spend || "",
                total_booking: inquiryData.total_booking || "",
                total_inqiry: inquiryData.total_inqiry || ""
            });
            setImagePreview(inquiryData.client_image || null);
            setVideoPreview(inquiryData.video || null);

            // Set selected city and salons if available
            if (inquiryData.salon_info && inquiryData.salon_info.length > 0) {
                const firstSalon = inquiryData.salon_info[0];
                setSelectedCity(firstSalon.city || "");

                const salonOptions = inquiryData.salon_info.map(salon => ({
                    value: salon.id,
                    label: salon.name,
                    area: salon.area,
                    city: salon.city
                }));
                setSelectedSalons(salonOptions);
            }
        }
    }, [inquiryData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files[0] || null
        }));
        if (name === "client_image") {
            setImagePreview(files[0] ? URL.createObjectURL(files[0]) : null);
        } else if (name === "video") {
            setVideoPreview(files[0] ? URL.createObjectURL(files[0]) : null);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, client_image: null }));
        setImagePreview(null);
    };

    const removeVideo = () => {
        setFormData(prev => ({ ...prev, video: null }));
        setVideoPreview(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const postData = new FormData();

        // Append selected salons
        selectedSalons.forEach(salon => {
            postData.append("salon_info", salon.value);
        });

        // Append other form data
        postData.append("campaign_name", formData.campaign_name);
        if (formData.client_image) {
            postData.append("client_image", formData.client_image);
        }
        if (formData.video) {
            postData.append("video", formData.video);
        }
        postData.append("duration_of_campaign", formData.duration_of_campaign);
        postData.append("starting_date", formData.starting_date);
        postData.append("expire_date", formData.expire_date);
        postData.append("caption", formData.caption);
        postData.append("hashtags", formData.hashtags);
        postData.append("budget_have", formData.budget_have);
        postData.append("budget_spend", formData.budget_spend);
        postData.append("total_booking", formData.total_booking);
        postData.append("total_inqiry", formData.total_inqiry);

        try {
            let url = `https://backendapi.trakky.in/salons/addspend/`;
            let method = "POST";

            // If editing, update the URL and method
            if (inquiryData && inquiryData.id) {
                url = `https://backendapi.trakky.in/salons/addspend/${inquiryData.id}/`;
                method = "PATCH";
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: "Bearer " + `${authTokens.access}`,
                },
                body: postData,
            });

            const responseData = await response.json();

            if (response.status === 201 || response.status === 200) {
                const successMessage = inquiryData ?
                    "Inquiry updated successfully" :
                    "Campaign created successfully";

                toast.success(successMessage, {
                    duration: 4000,
                    position: "top-center",
                    style: {
                        background: "green",
                        color: "#fff",
                    },
                });

                if (onSuccess) {
                    onSuccess(responseData);
                }

                // Only reset if not editing
                if (!inquiryData) {
                    setSelectedSalons([]);
                    setSelectedCity("");
                    setFormData({
                        campaign_name: "",
                        client_image: null,
                        video: null,
                        duration_of_campaign: "",
                        starting_date: "",
                        expire_date: "",
                        caption: "",
                        hashtags: "",
                        budget_have: "",
                        budget_spend: "",
                        total_booking: "",
                        total_inqiry: ""
                    });
                    setImagePreview(null);
                    setVideoPreview(null);
                }
            } else if (response.status === 401) {
                alert("You're logged out");
                logoutUser();
            } else {
                toast.error(`Error: ${response.status} - ${response.statusText}`, {
                    duration: 4000,
                    position: "top-center",
                    style: {
                        background: "red",
                        color: "#fff",
                    },
                });
            }
        } catch (error) {
            toast.error("Failed to process request. Please try again later.", {
                duration: 4000,
                position: "top-center",
                style: {
                    background: "red",
                    color: "#fff",
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCity = async () => {
        let url = `https://backendapi.trakky.in/salons/city/`;

        await fetch(url)
            .then((res) => res.json())
            .then((data) => {
                let city = data?.payload.map((item) => item.name);
                setCity(city);
            })
            .catch((err) => alert(err));
    };

    const loadSalons = async (inputValue, callback) => {
        if (inputValue !== "") {
            try {
                const response = await fetch(
                    `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
                        inputValue
                    )}&city=${selectedCity}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP status ${response.status}`);
                }

                const data = await response.json();

                const options = data?.results?.map((salon) => ({
                    value: salon.id,
                    label: salon.name,
                    area: salon.area,
                    city: salon.city
                }));

                callback(options);
            } catch (error) {
                console.error("Error fetching salons:", error.message);
                callback([]);
            }
        }
    };

    useEffect(() => {
        getCity();
    }, []);

    return (
        <>
            <Toaster />
            <div className="mx-auto px-4 py-4  rounded-xl ">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
                        <h3 className="text-2xl font-semibold text-gray-800">
                            {inquiryData ? "Edit Inquiry Campaign" : "Customer Inquiries Campaign"}
                        </h3>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                            onClick={handleBackToList}
                        >
                            Show List
                        </button>
                    </div>

                    {/* City Selection */}
                    <div className="mb-3">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
                        <select
                            name="city"
                            id="city"
                            value={selectedCity}
                            onChange={(e) => {
                                setSelectedSalons([]);
                                setSelectedCity(e.target.value);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                            required
                        >
                            <option value="">Select City</option>
                            {city.map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Salon Selection - Multiple */}
                    <div className="mb-3">
                        <label htmlFor="salons" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Salons
                            <span className="text-xs text-gray-500 ml-2">(Salons must belong to selected city)</span>
                        </label>
                        <AsyncSelect
                            isMulti
                            isDisabled={!selectedCity}
                            defaultOptions
                            loadOptions={loadSalons}
                            value={selectedSalons}
                            onChange={(selectedOptions) => {
                                setSelectedSalons(selectedOptions);
                            }}
                            noOptionsMessage={() => "No salons found"}
                            placeholder="Search Salons..."
                            classNamePrefix="select"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: '#f9fafb',
                                    borderColor: '#d1d5db',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        borderColor: '#9ca3af',
                                    },
                                    padding: '4px',
                                    borderRadius: '8px',
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '4px',
                                }),
                                menu: (base) => ({
                                    ...base,
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                }),
                            }}
                        />
                    </div>

                    {/* Campaign Name */}
                    <div className="mb-3">
                        <label htmlFor="campaign_name" className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                        <input
                            type="text"
                            name="campaign_name"
                            id="campaign_name"
                            value={formData.campaign_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                            required
                        />
                    </div>

                    {/* Client Image */}
                    <div className="mb-3">
                        <label htmlFor="client_image" className="block text-sm font-medium text-gray-700 mb-2">Client Image</label>
                        <input
                            type="file"
                            name="client_image"
                            id="client_image"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {imagePreview && (
                            <div className="mt-4 relative">
                                <img src={imagePreview} alt="Image Preview" className="max-w-xs rounded-lg shadow-md" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                >
                                    <FaTimes className="text-red-500" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Video */}
                    <div className="mb-3">
                        <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">Video (Optional)</label>
                        <input
                            type="file"
                            name="video"
                            id="video"
                            onChange={handleFileChange}
                            accept="video/*"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {videoPreview && (
                            <div className="mt-4 relative">
                                <video controls src={videoPreview} className="max-w-xs rounded-lg shadow-md" />
                                <button
                                    type="button"
                                    onClick={removeVideo}
                                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                >
                                    <FaTimes className="text-red-500" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Duration of Campaign */}
                    <div className="mb-3">
                        <label htmlFor="duration_of_campaign" className="block text-sm font-medium text-gray-700 mb-2">Duration of Campaign (days)</label>
                        <input
                            type="number"
                            name="duration_of_campaign"
                            id="duration_of_campaign"
                            value={formData.duration_of_campaign}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                            required
                            min="1"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
                        <div>
                            <label htmlFor="starting_date" className="block text-sm font-medium text-gray-700 mb-2">Starting Date</label>
                            <input
                                type="date"
                                name="starting_date"
                                id="starting_date"
                                value={formData.starting_date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="expire_date" className="block text-sm font-medium text-gray-700 mb-2">Expire Date</label>
                            <input
                                type="date"
                                name="expire_date"
                                id="expire_date"
                                value={formData.expire_date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                                required
                                min={formData.starting_date}
                            />
                        </div>
                    </div>

                    {/* Caption */}
                    <div className="mb-3">
                        <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                        <textarea
                            name="caption"
                            id="caption"
                            value={formData.caption}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50 resize-none"
                        />
                    </div>

                    {/* Hashtags */}
                    <div className="mb-3">
                        <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 mb-2">Hashtags (comma separated)</label>
                        <input
                            type="text"
                            name="hashtags"
                            id="hashtags"
                            value={formData.hashtags}
                            onChange={handleInputChange}
                            placeholder="e.g., #offer, #summer, #discount"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                        />
                    </div>

                    {/* Budget Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
                        <div>
                            <label htmlFor="budget_have" className="block text-sm font-medium text-gray-700 mb-2">Budget Allocated</label>
                            <input
                                type="number"
                                name="budget_have"
                                id="budget_have"
                                value={formData.budget_have}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label htmlFor="budget_spend" className="block text-sm font-medium text-gray-700 mb-2">Budget Spent</label>
                            <input
                                type="number"
                                name="budget_spend"
                                id="budget_spend"
                                value={formData.budget_spend}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
                        <div>
                            <label htmlFor="total_booking" className="block text-sm font-medium text-gray-700 mb-2">Total Bookings</label>
                            <input
                                type="number"
                                name="total_booking"
                                id="total_booking"
                                value={formData.total_booking}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label htmlFor="total_inqiry" className="block text-sm font-medium text-gray-700 mb-2">Total Inquiries</label>
                            <input
                                type="number"
                                name="total_inqiry"
                                id="total_inqiry"
                                value={formData.total_inqiry}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        {inquiryData && (
                            <button
                                type="button"
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-sm disabled:opacity-50"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative px-6 py-3 bg-[#502DA6] text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Submitting...
                                </div>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CustomerInquiriesForm;