import React, { useState, useEffect, useContext, useRef } from "react";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "../../Context/AuthContext";
import "./inquiry.css";
import { ConstructionOutlined } from "@mui/icons-material";
const InquiriesLeadsForm = ({ leadData, onSuccess, onCancel, isEditMode }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+91");
  const [countries, setCountries] = useState([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [error, setError] = useState("");
  // const [isLoadingRemarks, setIsLoadingRemarks] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({
    type: "call",
    date: "",
    time: "",
    comment: "",
    next_date: "",
    next_time: "",
  });
  const REMARKS_OPTIONS = [
    { value: "Customer not responding", label: "Customer not responding" },
    { value: "Other area inquiry", label: "Other area inquiry" },
    { value: "Called for job vacancy", label: "Called for job vacancy" },
    { value: "Fake", label: "Fake" },
    { value: "Booked somewhere else", label: "Booked somewhere else" },
    {
      value: "Customer deleted the message for everyone",
      label: "Customer deleted the message for everyone",
    },
    { value: "Stopped responding", label: "Stopped responding" },
    {
      value: "Delay in booking, time not confirm",
      label: "Delay in booking, time not confirm",
    },
    { value: "Other city inquiry", label: "Other city inquiry" },
    { value: "Wants home service", label: "Wants home service" },
    {
      value: "Salon option send, no reply",
      label: "Salon option send, no reply",
    },
    {
      value: "Dont want to visit currently",
      label: "Dont want to visit currently",
    },
    { value: "He/she inform soon", label: "He/she inform soon" },
    { value: "Want service after week", label: "Want service after week" },
    { value: "Want service after month", label: "Want service after month" },
    { value: "Not collaborated", label: "Not collaborated" },
    {
      value: "Will call when ready to visit",
      label: "Will call when ready to visit",
    },
    { value: "Price send, no reply", label: "Price send, no reply" },
    { value: "Currently busy", label: "Currently busy" },
    { value: "Only inquiry", label: "Only inquiry" },
    { value: "Currently out of city", label: "Currently out of city" },
    {
      value: "Area long, needed salon un same area",
      label: "Area long, needed salon un same area",
    },
    { value: "Want cheaper", label: "Want cheaper" },
    {
      value: "Hair length photo not shared",
      label: "Hair length photo not shared",
    },
  ];
  useEffect(() => {
    const handlePopState = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        setShowExitModal(true);
        window.history.pushState(null, "", window.location.pathname);
      }
    };
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);
  const loadCountries = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(
          inputValue
        )}?fields=name,cca2,idd,flags`
      );
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      return data
        .map((country) => ({
          value: country.idd?.root
            ? country.idd.root + (country.idd.suffixes?.[0] || "")
            : "",
          label: `${country.name.common} (${
            country.idd?.root
              ? country.idd.root + (country.idd.suffixes?.[0] || "")
              : "N/A"
          })`,
          code: country.cca2,
          flag: country.flags?.png || country.flags?.svg || "",
        }))
        .filter((c) => c.value);
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
  };
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd"
        );
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        const countryOptions = data
          .map((country) => ({
            value: country.idd?.root
              ? country.idd.root + (country.idd.suffixes?.[0] || "")
              : "",
            label: country.name.common,
            code: country.cca2,
          }))
          .filter((c) => c.value)
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(countryOptions);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);
  const validateMobileNumber = (number, code) => {
    const cleanNumber = number.replace(/\D/g, "");
    if (code === "+91") {
      return cleanNumber.length === 10;
    } else if (code === "+1") {
      return cleanNumber.length === 10;
    } else if (code === "+44") {
      return cleanNumber.length === 10;
    }
    return cleanNumber.length >= 8 && cleanNumber.length <= 15;
  };
  const ExitConfirmationModal = () => {
    if (!showExitModal) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <h3 className="text-lg font-medium mb-4">
            Are you sure you want to leave?
          </h3>
          <p className="mb-4">You have unsaved changes that will be lost.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowExitModal(false)}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowExitModal(false);
                setHasUnsavedChanges(false);
                navigate(-1); // go back
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    );
  };
  const handleFollowUpChange = (e) => {
    const { name, value } = e.target;
    setNewFollowUp((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasUnsavedChanges(true);
  };
  const addFollowUp = () => {
    if (!newFollowUp.date || !newFollowUp.time || !newFollowUp.comment) {
      toast.error("Please fill all required follow-up fields");
      return;
    }
    const followUpEntry = {
      date: newFollowUp.date,
      time: newFollowUp.time,
      comment: newFollowUp.comment,
      next_date: newFollowUp.next_date || "",
      next_time: newFollowUp.next_time || "",
    };
    setFormData((prev) => ({
      ...prev,
      follow_up: {
        call: prev.follow_up?.call || [],
        msg: prev.follow_up?.msg || [],
        [newFollowUp.type]: [
          ...(prev.follow_up?.[newFollowUp.type] || []),
          followUpEntry,
        ],
      },
    }));
    setNewFollowUp({
      type: "call",
      date: "",
      time: "",
      comment: "",
      next_date: "",
      next_time: "",
    });
    setHasUnsavedChanges(true);
  };
  const removeFollowUp = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      follow_up: {
        call: prev.follow_up?.call || [],
        msg: prev.follow_up?.msg || [],
        [type]: (prev.follow_up?.[type] || []).filter((_, i) => i !== index),
      },
    }));
    setHasUnsavedChanges(true);
  };
  const handleBackToList = () => {
    navigate("/inquiriesleads");
  };
  const SOURCE_CHOICES = [
    { value: "ads", label: "Ads" },
    { value: "retargeting", label: "Retargeting" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "special_case", label: "Special Case" },
    { value: "website", label: "Website" },
    { value: "direct-message", label: "Direct Message" },
  ];
  const [formData, setFormData] = useState(
    isEditMode
      ? {
          salon:
            leadData.salon && leadData.salon_info
              ? {
                  value: leadData.salon,
                  label: leadData.salon_info.name,
                }
              : null,
          masterservice: leadData.masterservice_info
            ? leadData.masterservice_info.map((service) => ({
                value: service.id,
                label: `${service.service_name} (${service.gender}) - ${service.category_name}`,
              }))
            : [],
          gender: leadData.gender || "",
          inquiry_date: leadData.inquiry_date
            ? leadData.inquiry_date.split("T")[0]
            : new Date().toISOString().split("T")[0],
          customer_name: leadData.customer_name || "",
          customer_mobile_number: leadData.customer_mobile_number || "",
          last_conversation_status: leadData.last_conversation_status || "",
          source_of_lead: leadData.source_of_lead || "",
          campaign: leadData.ad_spend
            ? {
                value: leadData.ad_spend,
                label: leadData.campaign_name,
              }
            : null,
          does_called_for_booking: leadData.does_called_for_booking || false,
          calling_history: leadData.calling_history || [],
          multiple_services: leadData.multiple_services || {},
          additional_areas: leadData.additional_areas || [],
          price_told: leadData.price_told || "",
          follow_up: leadData.follow_up || { call: [], msg: [] },
          remarks: leadData.remarks || {},
          remarks_response: leadData.remarks_response || "",
        }
      : {
          salon: null,
          masterservice: [],
          gender: "",
          inquiry_date: new Date().toISOString().split("T")[0],
          customer_name: "",
          customer_mobile_number: "",
          last_conversation_status: "",
          source_of_lead: "",
          campaign: null,
          does_called_for_booking: false,
          calling_history: [],
          multiple_services: {},
          additional_areas: [],
          selectedAreas: [],
          price_told: "",
          follow_up: { call: [], msg: [] },
          remarks: {},
          remarks_response: "",
        }
  );
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCampaignLoading, setIsCampaignLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [customStatusInput, setCustomStatusInput] = useState("");
  const [customStatuses, setCustomStatuses] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newCallHistory, setNewCallHistory] = useState({
    date: "",
    time: "",
    reason: "",
  });
  const [reasonInput, setReasonInput] = useState("");
  const [availableReasons, setAvailableReasons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryServices, setCategoryServices] = useState([]);
  const [otherServiceInput, setOtherServiceInput] = useState("");
  const [otherAreaInput, setOtherAreaInput] = useState("");
  const handleOtherServiceKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addOtherService();
    }
  };
  const handleStatusKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOrUpdateStatus();
    }
  };
  const handleReasonKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewReason();
    }
  };
  const handleOtherAreaKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addOtherArea();
    }
  };
  const DeletableTextArea = ({ items, onDelete, placeholder, areaType }) => {
    return (
      <div className="w-full border border-gray-300 rounded-md p-2 min-h-12 bg-white">
        {items.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 px-2 py-1 rounded-md text-sm"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => onDelete(index, areaType)}
                  className="ml-2 text-red-600 hover:text-red-800 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </div>
    );
  };
  const handleDeleteFromTextArea = (index, areaType) => {
    if (areaType === "services") {
      const servicesArray = Object.entries(formData.multiple_services || {});
      if (index >= 0 && index < servicesArray.length) {
        servicesArray.splice(index, 1);
        const newServices = Object.fromEntries(servicesArray);
        setFormData((prev) => ({
          ...prev,
          multiple_services: newServices,
        }));
      }
    } else if (areaType === "areas") {
      const allAreas = [
        ...(formData.selectedAreas
          ? formData.selectedAreas.map((area) => area.label)
          : []),
        ...(formData.additional_areas || []),
      ];
      if (index >= 0 && index < allAreas.length) {
        const selectedAreasCount = formData.selectedAreas
          ? formData.selectedAreas.length
          : 0;
        if (index < selectedAreasCount) {
          const newSelectedAreas = [...(formData.selectedAreas || [])];
          newSelectedAreas.splice(index, 1);
          setFormData((prev) => ({
            ...prev,
            selectedAreas: newSelectedAreas,
          }));
        } else {
          const newAdditionalAreas = [...(formData.additional_areas || [])];
          newAdditionalAreas.splice(index - selectedAreasCount, 1);
          setFormData((prev) => ({
            ...prev,
            additional_areas: newAdditionalAreas,
          }));
        }
      }
    }
  };
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    setNewCallHistory({
      date: formattedDate,
      time: formattedTime,
      reason: "",
    });
  }, []);
  const loadServices = async (inputValue, callback) => {
    if (!selectedCategory || !selectedCategory.id) {
      callback([]);
      return;
    }
    try {
      let url = `https://backendapi.trakky.in/salons/masterservice/`;
      if (inputValue) {
        url += `?service_name=${encodeURIComponent(inputValue)}&categories=${
          selectedCategory?.id
        }`;
      } else {
        url += `?categories=${selectedCategory?.id}`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      });
      if (response.status === 401) {
        logoutUser();
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      const options = data.results.map((service) => ({
        value: service.id,
        label: `${service.service_name} (${service.gender})`,
        ...service,
      }));
      callback(options);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
      callback([]);
    }
  };
  const handleServiceSelect = (selectedOptions) => {
    const newServices = { ...formData.multiple_services };
    selectedOptions.forEach((option) => {
      const serviceKey = Object.keys(newServices).length + 1;
      newServices[serviceKey] = `${option.label}`;
    });
    setFormData((prev) => ({
      ...prev,
      multiple_services: newServices,
    }));
  };
  const addCallHistory = () => {
    if (
      !newCallHistory.date ||
      !newCallHistory.time ||
      !newCallHistory.reason
    ) {
      toast.error("Please fill all call history fields");
      return;
    }
    const newEntry = {
      date: newCallHistory.date,
      time: newCallHistory.time,
      reason: newCallHistory.reason,
    };
    setFormData((prev) => ({
      ...prev,
      calling_history: [...prev.calling_history, newEntry],
    }));
    if (!availableReasons.includes(newCallHistory.reason)) {
      setAvailableReasons((prev) => [...prev, newCallHistory.reason]);
    }
    setNewCallHistory({
      date: "",
      time: "",
      reason: "",
    });
  };
  const removeCallHistory = (index) => {
    setFormData((prev) => ({
      ...prev,
      calling_history: prev.calling_history.filter((_, i) => i !== index),
    }));
  };
  const addNewReason = () => {
    if (!reasonInput.trim()) {
      toast.error("Please enter a reason");
      return;
    }
    if (!availableReasons.includes(reasonInput)) {
      setAvailableReasons((prev) => [...prev, reasonInput]);
      setReasonInput("");
      toast.success("Reason added to options!");
    } else {
      toast.error("Reason already exists");
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salons/masterservice/"
        );
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        setCategories(data.results || data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchCategoryServices = async () => {
      if (!selectedCategory) {
        setCategoryServices([]);
        return;
      }
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/masterservice/?categories=${selectedCategory.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        const topServices = data.results
          .sort((a, b) => a.priority - b.priority)
          .slice(0, 5);
        setCategoryServices(topServices);
      } catch (error) {
        console.error("Error fetching category services:", error);
        toast.error("Failed to load services");
      }
    };
    fetchCategoryServices();
  }, [selectedCategory]);
  const addOtherService = () => {
    if (!otherServiceInput.trim()) {
      toast.error("Please enter a service name");
      return;
    }
    const serviceKey = Object.keys(formData.multiple_services || {}).length + 1;
    setFormData((prev) => ({
      ...prev,
      multiple_services: {
        ...prev.multiple_services,
        [serviceKey]: otherServiceInput,
      },
    }));
    setOtherServiceInput("");
  };
  const addOtherArea = () => {
    if (!otherAreaInput.trim()) {
      toast.error("Please enter an area name");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      additional_areas: [...prev.additional_areas, otherAreaInput],
    }));
    setOtherAreaInput("");
  };
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("https://backendapi.trakky.in/salons/city/");
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        setCities(data.payload.map((city) => city.name));
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Failed to load cities");
      }
    };
    fetchCities();
  }, []);
  const loadAreas = async (inputValue, callback) => {
    try {
      let url = `https://backendapi.trakky.in/salons/area/`;
      if (inputValue) {
        url += `?name=${encodeURIComponent(inputValue)}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      const areasData = data.payload || data.results || data;
      let filteredAreas = areasData;
      if (inputValue) {
        const searchTerm = inputValue.toLowerCase();
        filteredAreas = areasData.filter(
          (area) => area.name && area.name.toLowerCase().includes(searchTerm)
        );
      }
      const options = filteredAreas.map((area) => ({
        value: area.id,
        label: area.name || "Unnamed Area",
      }));
      callback(options);
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error("Failed to load areas");
      callback([]);
    }
  };
  const loadCampaigns = async (inputValue, callback) => {
    try {
      let url = `https://backendapi.trakky.in/salons/addspend/`;
      if (inputValue) {
        url += `?campaign_name=${encodeURIComponent(inputValue)}`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      });
      if (response.status === 401) {
        logoutUser();
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      console.log("Campaign API response:", data);
      const campaignsData = data.results || data.payload || data;
      const options = campaignsData.map((campaign) => ({
        value: campaign.id,
        label: campaign.campaign_name,
        ...campaign,
      }));
      callback(options);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load campaigns");
      callback([]);
    }
  };
  const loadSalons = async (inputValue, callback) => {
    if (!selectedCity || inputValue === "") {
      callback([]);
      return;
    }
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
        ...salon,
      }));
      callback(options);
    } catch (error) {
      console.error("Error fetching salons:", error.message);
      toast.error("Failed to search salons");
      callback([]);
    }
  };
  const loadCategories = async (inputValue, callback) => {
    try {
      let url = `https://backendapi.trakky.in/salons/mastercategory/`;
      if (inputValue) {
        url += `?name=${encodeURIComponent(inputValue)}`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      });
      if (response.status === 401) {
        logoutUser();
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      setNextPage(data.next);
      const options = data.map((category) => ({
        value: category.id,
        label: `${category.name} - ${category.gender}`,
        ...category,
      }));
      callback(options);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      callback([]);
    }
  };
  const handleAddOrUpdateStatus = () => {
    if (!customStatusInput.trim()) {
      toast.error("Please enter a status");
      return;
    }
    if (editingStatusId) {
      setCustomStatuses((prev) =>
        prev.map((status) =>
          status.id === editingStatusId
            ? { ...status, text: customStatusInput }
            : status
        )
      );
      setEditingStatusId(null);
    } else {
      const newStatus = {
        id: Date.now(),
        text: customStatusInput,
      };
      setCustomStatuses((prev) => [...prev, newStatus]);
    }
    setCustomStatusInput("");
    toast.success(editingStatusId ? "Status updated!" : "Status added!");
  };
  const handleEditStatus = (status) => {
    setCustomStatusInput(status.text);
    setEditingStatusId(status.id);
  };
  const handleDeleteStatus = (statusId) => {
    setCustomStatuses((prev) =>
      prev.filter((status) => status.id !== statusId)
    );
    if (
      formData.last_conversation_status ===
      customStatuses.find((s) => s.id === statusId)?.text
    ) {
      setFormData((prev) => ({
        ...prev,
        last_conversation_status: "",
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Validation code remains the same...
    const allAreas = [
      ...(formData.selectedAreas
        ? formData.selectedAreas.map((area) => area.label)
        : []),
      ...(formData.additional_areas || []),
    ];
    const updatedRemarks = { ...formData.remarks };
    if (
      formData.remarks_response &&
      !Object.values(updatedRemarks).includes(formData.remarks_response)
    ) {
      const newKey = (Object.keys(updatedRemarks).length + 1).toString();
      updatedRemarks[newKey] = formData.remarks_response;
    }
    const payload = {
      masterservice: formData.masterservice.map((service) => service.value),
      gender: formData.gender,
      inquiry_date: formData.inquiry_date,
      customer_name: formData.customer_name || null,
      customer_mobile_number: formData.customer_mobile_number,
      last_conversation_status: formData.last_conversation_status || null,
      source_of_lead: formData.source_of_lead || null,
      does_called_for_booking: formData.does_called_for_booking,
      calling_history: formData.calling_history || [],
      areas: allAreas,
      multiple_services: formData.multiple_services,
      additional_areas: allAreas || [],
      price_told: formData.price_told || null,
      follow_up: {
        call: formData.follow_up?.call || [],
        msg: formData.follow_up?.msg || [],
      },
      remarks: updatedRemarks,
      remarks_response: formData.remarks_response || null,
    };
    if (formData.salon) {
      payload.salon = formData.salon.value;
    }
    if (formData.source_of_lead === "ads" && formData.campaign) {
      payload.ad_spend = formData.campaign.value;
      payload.campaign_name = formData.campaign.label;
    }
    try {
      let response;
      if (isEditMode) {
        response = await fetch(
          `https://backendapi.trakky.in/salons/inquiryleads/${leadData.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch(
          "https://backendapi.trakky.in/salons/inquiryleads/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: JSON.stringify(payload),
          }
        );
      }
      if (response.status === 401) {
        logoutUser();
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      toast.success(
        isEditMode
          ? "Lead updated successfully!"
          : "Inquiry/Lead created successfully!"
      );
      if (onSuccess) {
        onSuccess(data);
      }
      if (!isEditMode) {
        setFormData({
          salon: null,
          masterservice: [],
          gender: "",
          inquiry_date: new Date().toISOString().split("T")[0],
          customer_name: "",
          customer_mobile_number: "",
          last_conversation_status: "",
          source_of_lead: "",
          campaign: null,
          does_called_for_booking: false,
          calling_history: [],
          multiple_services: {},
          additional_areas: [],
          selectedAreas: [],
          price_told: "",
        });
        setCustomStatuses([]);
        setSelectedCity("");
        setSelectedCategory(null);
        setCategoryServices([]);
        setOtherServiceInput("");
        setOtherAreaInput("");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        isEditMode ? "Failed to update lead" : "Failed to create inquiry"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCustomerDetails = async (mobileNumber) => {
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
        if (data.results && data.results.length > 0) {
          const customer = data.results[0];
          setFormData((prev) => ({
            ...prev,
            customer_name: customer.customer_name || "",
            gender: customer.gender.toLowerCase() || "",
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const statusOptions = [
    { value: "converted", label: "Converted" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
    { value: "follow_up", label: "Follow Up" },
    ...customStatuses.map((status) => ({
      value: status.text,
      label: status.text,
    })),
  ];
  return (
    <div className="mx-auto bg-white rounded-xl shadow-md md:p-4 p-2 md:m-2 m-2">
      <Toaster position="top-right" />
      <ExitConfirmationModal />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {isEditMode ? "Edit Lead" : "Create New Lead"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadCategories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Search categories..."
                noOptionsMessage={() => "Type to search categories"}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "36px",
                    borderColor: "#d1d5db",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Top Services
              </label>
              <AsyncSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadServices}
                value={null}
                onChange={handleServiceSelect}
                placeholder="Search services..."
                noOptionsMessage={() =>
                  "Select a category first or type to search"
                }
                isDisabled={!selectedCategory}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "36px",
                    borderColor: "#d1d5db",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Other Service
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={otherServiceInput}
                  onKeyDown={handleOtherServiceKeyDown}
                  onChange={(e) => setOtherServiceInput(e.target.value)}
                  placeholder="Enter service name"
                />
                <button
                  type="button"
                  onClick={addOtherService}
                  className="px-3 py-1.5 bg-[#502DA6] text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  +
                </button>
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Services
              </label>
              <DeletableTextArea
                items={Object.values(formData.multiple_services || {})}
                onDelete={handleDeleteFromTextArea}
                placeholder="No services selected"
                areaType="services"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country Code
              </label>
              <AsyncSelect
                cacheOptions
                loadOptions={loadCountries}
                defaultOptions={[]}
                onChange={(selectedOption) => {
                  setCountryCode(selectedOption.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Search country..."
                className="react-select-container"
                classNamePrefix="react-select"
                formatOptionLabel={(country) => (
                  <div className="flex items-center gap-2">
                    <img
                      src={country.flag}
                      alt=""
                      className="w-5 h-4 object-cover"
                    />
                    <span>{country.label}</span>
                  </div>
                )}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "36px",
                    borderColor: "#d1d5db",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                name="customer_mobile_number"
                value={formData.customer_mobile_number}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    customer_mobile_number: value,
                  }));
                  setHasUnsavedChanges(true);
                  if (validateMobileNumber(value, countryCode)) {
                    fetchCustomerDetails(value);
                  }
                }}
                placeholder="Enter mobile number"
                required
              />
              {!validateMobileNumber(
                formData.customer_mobile_number,
                countryCode
              ) &&
                formData.customer_mobile_number.length > 0 && (
                  <p className="text-red-500 text-xs mt-1">
                    Valid mobile for {countryCode}
                  </p>
                )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source of Lead
              </label>
              <select
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                name="source_of_lead"
                value={formData.source_of_lead}
                onChange={(e) => {
                  handleInputChange(e);
                  setHasUnsavedChanges(true);
                }}
              >
                <option value="">Select Source</option>
                {SOURCE_CHOICES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formData.source_of_lead === "ads" && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-500 mb-1">
                    Campaign
                  </label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadCampaigns}
                    value={formData.campaign}
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        campaign: selectedOption,
                      }))
                    }
                    placeholder="Search campaigns..."
                    noOptionsMessage={() => "Type to search campaigns"}
                    isLoading={isCampaignLoading}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: "30px",
                        borderColor: "#d1d5db",
                        "&:hover": {
                          borderColor: "#9ca3af",
                        },
                      }),
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setFormData((prev) => ({ ...prev, salon: null, areas: [] }));
                  setHasUnsavedChanges(true);
                }}
                required
              >
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interested Areas <span className="text-red-500">*</span>
              </label>
              <AsyncSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadAreas}
                value={formData.selectedAreas || []}
                onChange={(selectedOptions) => {
                  setFormData((prev) => ({
                    ...prev,
                    selectedAreas: selectedOptions,
                  }));
                  setHasUnsavedChanges(true);
                }}
                placeholder="Select areas..."
                noOptionsMessage={() => "Type to search areas"}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "36px",
                    borderColor: "#d1d5db",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Other Area
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={otherAreaInput}
                  onKeyDown={handleOtherAreaKeyDown}
                  onChange={(e) => {
                    setOtherAreaInput(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="Enter custom area"
                />
                <button
                  type="button"
                  onClick={addOtherArea}
                  className="px-3 py-1.5 bg-[#502DA6] text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                name="gender"
                value={formData.gender}
                onChange={(e) => {
                  handleInputChange(e);
                  setHasUnsavedChanges(true);
                }}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                name="customer_name"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={formData.customer_name}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/\d/.test(value)) {
                    setError("Numbers not allowed in name");
                  } else {
                    setError("");
                    handleInputChange(e);
                    setHasUnsavedChanges(true);
                  }
                }}
                placeholder="Enter name"
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inquiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                name="inquiry_date"
                value={formData.inquiry_date}
                onChange={(e) => {
                  handleInputChange(e);
                  setHasUnsavedChanges(true);
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interested Salon
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadSalons}
                value={formData.salon}
                onChange={(selectedOption) => {
                  setFormData((prev) => ({ ...prev, salon: selectedOption }));
                  setHasUnsavedChanges(true);
                }}
                placeholder="Search salons..."
                noOptionsMessage={() => "Type to search salons"}
                isDisabled={!selectedCity}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "36px",
                    borderColor: "#d1d5db",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Told
              </label>
              <input
                type="number"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                name="price_told"
                value={formData.price_told}
                onChange={(e) => {
                  handleInputChange(e);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Enter price"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                All Selected Areas
              </label>
              <DeletableTextArea
                items={[
                  ...(formData.selectedAreas
                    ? formData.selectedAreas.map((area) => area.label)
                    : []),
                  ...(formData.additional_areas || []),
                ]}
                onDelete={handleDeleteFromTextArea}
                placeholder="No areas selected"
                areaType="areas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Called for Booking?
              </label>
              <select
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={formData.does_called_for_booking.toString()}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    does_called_for_booking: e.target.value === "true",
                  }));
                  setHasUnsavedChanges(true);
                }}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <select
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={formData.remarks_response || ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    remarks_response: e.target.value,
                  }));
                  setHasUnsavedChanges(true);
                }}
              >
                <option value="">Select Remark</option>
                {REMARKS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Conversation Status <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={formData.last_conversation_status}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    last_conversation_status: e.target.value,
                  }));
                  setHasUnsavedChanges(true);
                }}
              >
                <option value="">Select Status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingStatusId ? "Edit Custom Status" : "Add Custom Status"}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={customStatusInput}
                  onKeyDown={handleStatusKeyDown}
                  onChange={(e) => {
                    setCustomStatusInput(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="Enter status"
                />
                <button
                  type="button"
                  onClick={handleAddOrUpdateStatus}
                  className="px-3 py-1.5 bg-[#502DA6] text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  {editingStatusId ? "Update" : "Add"}
                </button>
                {editingStatusId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStatusId(null);
                      setCustomStatusInput("");
                    }}
                    className="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Statuses
              </label>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-10 text-sm">
                {customStatuses.length > 0 ? (
                  customStatuses.map((status) => (
                    <div
                      key={status.id}
                      className="flex items-center bg-gray-100 px-2 py-1 rounded-md"
                    >
                      <span>{status.text}</span>
                      <div className="flex space-x-2 ml-2">
                        <button
                          type="button"
                          onClick={() => handleEditStatus(status)}
                          className="text-[#502DA6] hover:text-indigo-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStatus(status.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500">No custom statuses</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-300">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Call History
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={newCallHistory.date}
                  onChange={(e) => {
                    setNewCallHistory((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }));
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={newCallHistory.time}
                  onChange={(e) => {
                    setNewCallHistory((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }));
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <select
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={newCallHistory.reason}
                  onChange={(e) => {
                    setNewCallHistory((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }));
                    setHasUnsavedChanges(true);
                  }}
                >
                  <option value="">Select Reason</option>
                  {availableReasons.map((reason, index) => (
                    <option key={index} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={addCallHistory}
                className="px-4 py-1.5 bg-[#502DA6] text-white rounded-md hover:bg-indigo-700 text-sm"
              >
                Add Call Entry
              </button>
              <input
                type="text"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={reasonInput}
                onKeyDown={handleReasonKeyDown}
                onChange={(e) => {
                  setReasonInput(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="New reason"
              />
              <button
                type="button"
                onClick={addNewReason}
                className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Add Reason
              </button>
            </div>
            {formData.calling_history && formData.calling_history.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Time
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Reason
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.calling_history.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                          {entry.date}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                          {entry.time}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                          {entry.reason}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => removeCallHistory(index)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-300">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Follow Up Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 p-2 bg-gray-50 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={newFollowUp.type}
                  onChange={handleFollowUpChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="call">Call</option>
                  <option value="msg">Message</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={newFollowUp.date}
                  onChange={handleFollowUpChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={newFollowUp.time}
                  onChange={handleFollowUpChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Date
                </label>
                <input
                  type="date"
                  name="next_date"
                  value={newFollowUp.next_date}
                  onChange={handleFollowUpChange}
                  min={newFollowUp.date}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Time
                </label>
                <input
                  type="time"
                  name="next_time"
                  value={newFollowUp.next_time}
                  onChange={handleFollowUpChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment *
                </label>
                <textarea
                  name="comment"
                  value={newFollowUp.comment}
                  onChange={handleFollowUpChange}
                  rows="2"
                  placeholder="Enter details..."
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={addFollowUp}
                className="md:col-span-3 px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Add Follow Up
              </button>
            </div>
            <div className="space-y-2">
              {(formData.follow_up?.call || []).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Call Follow Ups ({(formData.follow_up?.call || []).length})
                  </h4>
                  <div className="space-y-2">
                    {(formData.follow_up?.call || []).map((followUp, index) => (
                      <div
                        key={`call-${index}`}
                        className="flex justify-between p-3 bg-blue-50 rounded-md text-sm"
                      >
                        <div>
                          <div className="flex space-x-3">
                            <span>
                              <strong>Date:</strong> {followUp.date} {followUp.time}
                            </span>
                            {followUp.next_date && (
                              <span>
                                <strong>Next:</strong> {followUp.next_date} {followUp.next_time}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{followUp.comment}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFollowUp("call", index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(formData.follow_up?.msg || []).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Message Follow Ups ({(formData.follow_up?.msg || []).length})
                  </h4>
                  <div className="space-y-2">
                    {(formData.follow_up?.msg || []).map((followUp, index) => (
                      <div
                        key={`msg-${index}`}
                        className="flex justify-between p-3 bg-green-50 rounded-md text-sm"
                      >
                        <div>
                          <div className="flex space-x-3">
                            <span>
                              <strong>Date:</strong> {followUp.date} {followUp.time}
                            </span>
                            {followUp.next_date && (
                              <span>
                                <strong>Next:</strong> {followUp.next_date} {followUp.next_time}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{followUp.comment}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFollowUp("msg", index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(formData.follow_up?.call || []).length === 0 &&
                (formData.follow_up?.msg || []).length === 0 && (
                  <p className="text-gray-500 text-center text-sm py-2">
                    No follow-ups added.
                  </p>
                )}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
          <button
            onClick={handleBackToList}
            className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
          >
            Show List
          </button>
          <button
            type="button"
            onClick={onCancel || handleBackToList}
            className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-1.5 bg-[#502DA6] text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm"
          >
            {isLoading ? "Processing..." : isEditMode ? "Update" : "Submit"}
          </button>
        </div>
      </form>
      <style>
        {`
          .horizontal-scroll-container {
            overflow-x: auto;
            white-space: nowrap;
            -webkit-overflow-scrolling: touch;
          }
          .horizontal-scroll-container::-webkit-scrollbar {
            height: 4px;
          }
          .horizontal-scroll-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .horizontal-scroll-container::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }
          .horizontal-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}
      </style>
    </div>
  );
};
export default InquiriesLeadsForm;