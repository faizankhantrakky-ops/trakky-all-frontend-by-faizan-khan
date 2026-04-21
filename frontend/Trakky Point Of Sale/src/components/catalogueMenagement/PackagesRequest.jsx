import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/Auth";
import { ToastContainer } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { Delete } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  IconButton,
} from "@mui/material";

const PackagesRequest = () => {
  const [packageRequestData, setPackageRequestData] = useState([]);
  const [packageRequestDataLoading, setpackageRequestDataLoading] = useState(true);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const { authTokens, vendorData } = useContext(AuthContext);
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [formData, setFormData] = useState({
    package_name: "",
    actual_price: "",
    discounted_price: "",
    serviceHours: "",
    serviceMinutes: "",
    serviceSeating: "",
  });

  const [selectedServicesByCategory, setSelectedServicesByCategory] = useState({}); // { categoryId: [serviceIds] }
  const [customServices, setCustomServices] = useState([]); // Full fields: name, price, hours, minutes, seating
  const [showCustomSection, setShowCustomSection] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // Current selected category for filtering
  const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState({
    packageName: "",
    status: "",
  });

  const [serviceDates, setServiceDates] = useState({}); // {serviceId: ["yyyy-mm-dd", ...] }

  const [openImageModal, setOpenImageModal] = useState(false);
  const [packageImages, setPackageImages] = useState([]); // [{categoryId, file, preview}]
  const [tempCategory, setTempCategory] = useState("");
  const [tempFiles, setTempFiles] = useState([]); // Array of files

  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const isMobile = window.innerWidth < 768;

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  useEffect(() => {
    let result = packageRequestData;
    if (filters.packageName) {
      result = result.filter((item) =>
        item.package_name.toLowerCase().includes(filters.packageName.toLowerCase())
      );
    }
    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }
    setFilteredData(result);
  }, [packageRequestData, filters]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Trigger custom section with one default input
  const triggerCustomService = () => {
    setShowCustomSection(true);
    if (customServices.length === 0) {
      setCustomServices([{ name: "", price: "", hours: "", minutes: "", seating: "" }]);
    }
  };

  // Add more custom service
  const addCustomService = () => {
    setCustomServices([...customServices, { name: "", price: "", hours: "", minutes: "", seating: "" }]);
  };

  // Update custom service field
  const handleCustomServiceChange = (index, field, value) => {
    const updated = [...customServices];
    updated[index][field] = value;
    setCustomServices(updated);
  };

  // Remove custom service
  const removeCustomService = (index) => {
    const updated = customServices.filter((_, i) => i !== index);
    setCustomServices(updated);
    if (updated.length === 0) {
      setShowCustomSection(false);
    }
  };

  const fetchCategories = async () => {
                if (!navigator.onLine) {
            toast.error("No Internet Connection");
            return;
          }

    if (!vendorData?.salon) return;
    const url = `https://backendapi.trakky.in/salons/category/?salon_id=${vendorData?.salon}`;
    try {
      const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
      const data = await response.json();
      if (response.ok) setCategories(Array.isArray(data) ? data : []);
      else toast.error("Failed to fetch categories");
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  const fetchservices = async () => {
                if (!navigator.onLine) {
            toast.error("No Internet Connection");
            return;
          }
    if (!vendorData?.salon) return;
    setpackageRequestDataLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/service/?salon_id=${vendorData.salon}`,
        { method: "GET" }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Fetched services:", data); // Debug log
        setServiceOptions(Array.isArray(data) ? data : []);
      }
      else toast.error("Failed to fetch services");
    } catch (error) {
      toast.error("Error fetching services");
    } finally {
      setpackageRequestDataLoading(false);
    }
  };

  useEffect(() => {
    if (vendorData?.salon) {
      fetchservices();
      fetchCategories();
    }
  }, [vendorData]);

  useEffect(() => {
    fetchPackageRequest();
  }, []);

  const fetchPackageRequest = async () => {
                if (!navigator.onLine) {
            toast.error("No Internet Connection");
            return;
          }
    setpackageRequestDataLoading(true);
    try {
      const response = await fetch("https://backendapi.trakky.in/salonvendor/package-requests/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const sortedData = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          : [];
        setPackageRequestData(sortedData);
        setFilteredData(sortedData);
      } else {
        toast.error("Failed to fetch packages");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setpackageRequestDataLoading(false);
    }
  };

  const handleOpen = (productData) => {
    if (productData) {
      setEditMode(true);
      setFormData({
        package_name: productData.package_name || "",
        actual_price: productData.actual_price || "",
        discounted_price: productData.discounted_price || "",
        serviceHours: productData.package_time?.hours || 0,
        serviceMinutes: productData.package_time?.minutes || 0,
        serviceSeating: productData.package_time?.seating || 0,
      });
      setSelectedPackageId(productData.id);

      if (productData.services_included) {
        const newSelectedByCat = {};
        const newDates = {};
        const newCustom = [];

        productData.services_included.forEach((group) => {
          const catName = Object.keys(group)[0];
          const services = group[catName];

          if (catName === "Custom Services") {
            newCustom.push(
              ...services.map((s) => ({
                name: s.service_name || "",
                price: s.price || "",
                hours: s.time?.hours || "",
                minutes: s.time?.minutes || "",
                seating: s.time?.seating || "",
              }))
            );
          } else {
            const catId = categories.find((c) => c.name === catName)?.id;
            if (catId) {
              const serviceIds = services.map((s) => s.service_id).filter((id) => id !== null);
              if (serviceIds.length > 0) {
                newSelectedByCat[catId] = serviceIds;
              }
              services.forEach((s) => {
                if (s.service_id) {
                  newDates[s.service_id] = s.seating_dates;
                }
              });
            }
          }
        });

        setSelectedServicesByCategory(newSelectedByCat);
        setCustomServices(newCustom);
        setShowCustomSection(newCustom.length > 0);
        setServiceDates(newDates);
      } else {
        setSelectedServicesByCategory(productData.selected_services_by_category || {});
        setCustomServices(
          productData.custom_services?.length > 0
            ? productData.custom_services.map((s) => ({
              name: s.name || "",
              price: s.price || "",
              hours: s.time?.hours || "",
              minutes: s.time?.minutes || "",
              seating: s.time?.seating || "",
            }))
            : []
        );
        setShowCustomSection(productData.custom_services?.length > 0);
        setServiceDates(productData.service_dates || {});
      }

      setSelectedCategory("");
    } else {
      setEditMode(false);
      setFormData({
        package_name: "",
        actual_price: "",
        discounted_price: "",
        serviceHours: "",
        serviceMinutes: "",
        serviceSeating: "",
      });
      setSelectedPackageId(null);
      setSelectedServicesByCategory({});
      setCustomServices([]);
      setShowCustomSection(false);
      setSelectedCategory("");
      setServiceDates({});
    }
    setPackageImages([]);
    setTempCategory("");
    setTempFiles([]);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleAddImages = () => {
    if (!tempCategory || tempFiles.length === 0) {
      toast.error("Please select a category and at least one image");
      return;
    }
    const newImages = tempFiles.map((file) => ({
      categoryId: tempCategory,
      file,
      preview: URL.createObjectURL(file),
    }));
    setPackageImages([...packageImages, ...newImages]);
    setOpenImageModal(false);
    setTempCategory("");
    setTempFiles([]);
  };

  const removeImage = (index) => {
    const updated = packageImages.filter((_, i) => i !== index);
    setPackageImages(updated);
  };

  const removeTempImage = (index) => {
    const updated = tempFiles.filter((_, i) => i !== index);
    setTempFiles(updated);
  };

  const handleSubmit = async () => {
    if (!formData.package_name) {
      toast.error("Please fill required fields");
      return;
    }

    // Validate custom services
    for (const cs of customServices) {
      if (cs.name.trim() && (!cs.price || !cs.hours || !cs.minutes)) {
        toast.error("Please fill all fields for custom services");
        return;
      }
    }

    // Validate service dates
    const allSelectedServices = Object.values(selectedServicesByCategory).flat();
    for (const sid of allSelectedServices) {
      const service = serviceOptions.find((s) => s.id === sid);
      const seating = service?.service_time?.seating || 0;
      if (seating > 0) {
        const dates = serviceDates[sid] || [];
        if (dates.length !== seating || dates.some((d) => !d)) {
          toast.error(`Please fill all dates for ${service.service_name}`);
          return;
        }
      }
    }

    // Calculate prices
    const apiPrice = serviceOptions
      .filter((s) => allSelectedServices.includes(s.id))
      .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);

    const customPrice = customServices
      .filter((cs) => cs.name.trim() !== "")
      .reduce((sum, cs) => sum + (parseFloat(cs.price) || 0), 0);

    const totalActualPrice = apiPrice + customPrice;

    // Build services_included
    const services_included = [];

    // Add selected API services
    for (const [catId, serviceIds] of Object.entries(selectedServicesByCategory)) {
      const catName = categories.find((c) => c.id === parseInt(catId))?.name || "Unknown Category";
      const catServices = serviceIds.map((sid) => {
        const service = serviceOptions.find((s) => s.id === sid);
        return {
          service_id: service?.id || null,
          service_name: service?.service_name || "Unknown",
          price: service?.price || 0,
          time: {
            hours: service?.service_time?.hours || 0,
            minutes: service?.service_time?.minutes || 0,
            days: service?.service_time?.days || 0,
            seating: service?.service_time?.seating || 0,
          },
          seating_dates: serviceDates[sid] || [],
        };
      });
      if (catServices.length > 0) {
        services_included.push({ [catName]: catServices });
      }
    }

    // Add custom services
    const filteredCustom = customServices.filter((cs) => cs.name.trim() !== "");
    if (filteredCustom.length > 0) {
      const customCat = filteredCustom.map((cs) => ({
        service_id: null,
        service_name: cs.name,
        price: parseFloat(cs.price) || 0,
        time: {
          hours: parseInt(cs.hours) || 0,
          minutes: parseInt(cs.minutes) || 0,
          days: 0,
          seating: parseInt(cs.seating) || 0,
        },
        seating_dates: [],
      }));
      services_included.push({ "Custom Services": customCat });
    }



    const formDataPayload = new FormData();


      let branchId = localStorage.getItem("branchId") || "";


    // -----------------------------
    // 1️⃣ APPEND IMAGES ONE BY ONE
    // -----------------------------
    packageImages.forEach((img, index) => {
      formDataPayload.append(`images[${index}]`, img.file);

      // image meta for each image
      formDataPayload.append(
        `image_meta[${index}]`,
        JSON.stringify({ category_id: img.categoryId })
      );
    });

    formDataPayload.append("package_name", formData.package_name);
    formDataPayload.append("actual_price", totalActualPrice);
    formDataPayload.append("discounted_price", formData.discounted_price);

    // Package time fields individually
    formDataPayload.append("package_time[hours]", parseInt(formData.serviceHours) || 0);
    formDataPayload.append("package_time[minutes]", parseInt(formData.serviceMinutes) || 0);
    formDataPayload.append("package_time[seating]", parseInt(formData.serviceSeating) || 0);

    // services_included (array → JSON)
    formDataPayload.append("services_included", JSON.stringify(services_included));

    // vendor + salon
    formDataPayload.append("vendor_user", vendorData?.id);
    formDataPayload.append("salon", vendorData?.salon);
    // formDataPayload.append("branchId", branchId);


    try {
      let response;
      if (editMode) {
        response = await fetch(
          `https://backendapi.trakky.in/salonvendor/package-requests/${selectedPackageId}/`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
            body: formDataPayload,
          }
        );
      } else {
        response = await fetch("https://backendapi.trakky.in/salonvendor/package-requests/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: formDataPayload,
        });
      }

      const data = await response.json();
      if (response.ok) {
        toast.success(editMode ? "Updated!" : "Created!");
        if (editMode) {
          setPackageRequestData((prev) =>
            prev.map((item) => (item.id === selectedPackageId ? data : item))
          );
        } else {
          setPackageRequestData([data, ...packageRequestData]);
        }
        handleClose();
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const deleteServiceRequest = async (id) => {
    confirm({ description: "Delete this package?" })
      .then(async () => {
        try {
          const response = await fetch(
            `https://backendapi.trakky.in/salonvendor/package-requests/${id}/`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authTokens?.access_token}`,
              },
            }
          );
          if (response.ok) {
            toast.success("Deleted");
            setPackageRequestData((prev) => prev.filter((item) => item.id !== id));
          }
        } catch (error) {
          toast.error("Error");
        }
      })
      .catch(() => { });
  };

  // Auto update actual price
  useEffect(() => {
    const allSelectedServices = Object.values(selectedServicesByCategory).flat();
    const apiPrice = serviceOptions
      .filter((s) => allSelectedServices.includes(s.id))
      .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);

    const customPrice = customServices
      .filter((cs) => cs.name.trim() !== "")
      .reduce((sum, cs) => sum + (parseFloat(cs.price) || 0), 0);

    setFormData((prev) => ({ ...prev, actual_price: apiPrice + customPrice }));

    // Clean serviceDates
    setServiceDates((prev) => {
      const newDates = {};
      for (const sid of allSelectedServices) {
        if (prev[sid]) newDates[sid] = prev[sid];
      }
      return newDates;
    });
  }, [selectedServicesByCategory, serviceOptions, customServices]);

  // FIXED: Better filtering logic for services
  const filteredServiceOptions = selectedCategory
    ? serviceOptions.filter((service) => {
        // Check different possible formats of categories in service data
        const serviceCategories = service.categories;
        
        // If categories is a string/number (single category ID)
        if (typeof serviceCategories === 'string' || typeof serviceCategories === 'number') {
          return String(serviceCategories) === String(selectedCategory);
        }
        
        // If categories is an array
        if (Array.isArray(serviceCategories)) {
          return serviceCategories.some(cat => {
            if (typeof cat === 'object' && cat !== null) {
              // If category is object with id property
              return String(cat.id) === String(selectedCategory);
            }
            // If category is ID directly in array
            return String(cat) === String(selectedCategory);
          });
        }
        
        // If categories is an object with id property
        if (serviceCategories && typeof serviceCategories === 'object') {
          return String(serviceCategories.id) === String(selectedCategory);
        }
        
        return false;
      })
    : serviceOptions;

  console.log("Selected Category:", selectedCategory); // Debug
  console.log("Filtered Services:", filteredServiceOptions); // Debug
  console.log("All Services:", serviceOptions); // Debug

  const getTruncatedServices = (servicesIncluded) => {
    if (!Array.isArray(servicesIncluded)) return "Not Provided";
    let allServices = [];
    servicesIncluded.forEach(group => {
      const catServices = Object.values(group)[0];
      allServices.push(...catServices.map(s => s.service_name));
    });
    if (allServices.length <= 2) {
      return <span>{allServices.join(", ")}</span>;
    } else {
      return (
        <span>
          {allServices.slice(0, 2).join(", ")}
          <span className="cursor-pointer text-blue-500"> ...</span>
        </span>
      );
    }
  };

  const handleOpenDetails = (item) => {
    setSelectedPackage(item);
    setOpenDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailsModal(false);
    setSelectedPackage(null);
  };

  const getAllServices = (servicesIncluded) => {
    let allServices = [];
    servicesIncluded.forEach(group => {
      const catName = Object.keys(group)[0];
      const catServices = Object.values(group)[0];
      catServices.forEach(s => {
        allServices.push({
          category: catName,
          name: s.service_name,
          price: s.price,
          hours: s.time.hours,
          minutes: s.time.minutes,
          days: s.time.days,
          seating: s.time.seating,
          seatingDates: s.seating_dates ? s.seating_dates.join(", ") : "-"
        });
      });
    });
    return allServices;
  };

  return (
    <>
      <div className="w-full h-full bg-[#EFECFF]">
        <ToastContainer />
        {isMobile ? (
          <div className="flex justify-between items-center p-4">
            <IconButton onClick={() => window.history.back()}>
              <ArrowBackIcon className="text-black" />
            </IconButton>
            <div className="text-lg font-bold text-center flex-1">Package Request</div>
            <IconButton className="border border-black" onClick={() => handleOpen(null)}>
              <MoreVertIcon className="text-black" />
            </IconButton>
          </div>
        ) : (
          <div className="flex justify-between items-center p-4">
            <div className="text-lg font-bold md:text-xl">Package Request</div>
            <button
              className="rounded-md bg-black text-white px-4 py-2 text-sm"
              onClick={() => handleOpen(null)}
            >
              Add Package Request
            </button>
          </div>
        )}

        <div className="flex gap-4 p-4 mb-4">
          <TextField
            label="Package Name"
            variant="outlined"
            size="small"
            value={filters.packageName}
            onChange={(e) => {
              const value = e.target.value;

              // Allow only letters and spaces
              if (/^[A-Za-z\s]*$/.test(value)) {
                handleFilterChange("packageName", value);
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                },
              },
              width: { xs: "100%", sm: "auto" },
            }}
          />

          <FormControl
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 12px rgba(0,0,0,0.15)" },
              },
              width: { xs: "100%", sm: 180 },
            }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="w-full h-[calc(100%-60px)] md:h-[calc(100%-68px)] mt-1 overflow-auto">
          <div className="w-full pb-2 px-4">
            <table className="border-collapse w-full bg-white rounded-lg text-center min-w-max">
              <thead>
                <tr>
                  <th className="border border-gray-200 p-2">Sr no.</th>
                  <th className="border border-gray-200 p-2">Package name</th>
                  <th className="border border-gray-200 p-2">Services</th>
                  <th className="border border-gray-200 p-2">Price</th>
                  <th className="border border-gray-200 p-2">Discounted Price</th>
                  <th className="border border-gray-200 p-2">Request date</th>
                  <th className="border border-gray-200 p-2">Status</th>
                  <th className="border border-gray-200 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {packageRequestDataLoading ? (
                  <tr>
                    <td colSpan="8" className="py-10">
                      <CircularProgress sx={{ color: "#000" }} />
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-gray-200 py-2">{index + 1}</td>
                      <td className="border border-gray-200 px-2">{item.package_name || "-"}</td>
                      <td className="border border-gray-200 px-2 cursor-pointer" onClick={() => handleOpenDetails(item)}>
                        {getTruncatedServices(item.services_included)}
                      </td>
                      <td className="border border-gray-200 px-2">₹{item.actual_price || "0"}</td>
                      <td className="border border-gray-200 px-2">₹{item.discounted_price || "0"}</td>
                      <td className="border border-gray-200 px-2">
                        {item.created_at ? dayjs(item.created_at).format("DD-MM-YYYY") : "-"}
                      </td>
                      <td className="border border-gray-200 p-3">
                        {item.status === "PENDING" ? (
                          <span className="text-blue-600 bg-blue-200 py-1 px-3 text-sm rounded-md">Pending</span>
                        ) : item.status === "approved" ? (
                          <span className="text-emerald-600 bg-emerald-200 py-1 px-3 text-sm rounded-md">Approved</span>
                        ) : item.status === "REJECTED" ? (
                          <span className="text-red-600 bg-red-200 py-1 px-3 text-sm rounded-md">Rejected</span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="border border-gray-200 px-2">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpen(item)}
                            className={`${item.status !== "PENDING" ? "invisible" : ""}`}
                          >
                            <EditIcon />
                          </button>
                          <button onClick={() => deleteServiceRequest(item.id)}>
                            <Delete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-10">No package requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    


      <Modal open={open} onClose={handleClose}>
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center h-full p-4"
        >
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editMode ? "Edit" : "Add"} Package Request</h2>
              <CloseIcon onClick={handleClose} className="cursor-pointer" />
            </div>

            <div className="space-y-4">
              <TextField
                label="Package Name *"
                name="package_name"
                value={formData.package_name}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow only letters + spaces
                  if (/^[A-Za-z\s]*$/.test(value)) {
                    handleChange(e); // your existing handler
                  }
                }}
                fullWidth
                required
              />


              {/* Category Dropdown */}
              <FormControl fullWidth>
                <InputLabel>Select Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Select Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Services Dropdown - Only show when category is selected */}
              {selectedCategory && (
                <FormControl fullWidth>
                  <InputLabel>Select Services</InputLabel>
                  <Select
                    multiple
                    value={selectedServicesByCategory[selectedCategory] || []}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedServicesByCategory((prev) => ({
                        ...prev,
                        [selectedCategory]: value,
                      }));
                    }}
                    input={<OutlinedInput label="Select Services" />}
                    renderValue={(selected) =>
                      selected
                        .map((id) => serviceOptions.find((s) => s.id === id)?.service_name)
                        .filter(Boolean)
                        .join(", ")
                    }
                    MenuProps={MenuProps}
                  >
                    {filteredServiceOptions.length > 0 ? (
                      filteredServiceOptions.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          <Checkbox checked={(selectedServicesByCategory[selectedCategory] || []).includes(service.id)} />
                          <ListItemText primary={service.service_name} />
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No services found for this category</MenuItem>
                    )}
                  </Select>
                  {filteredServiceOptions.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No services available for selected category. Try selecting a different category.
                    </p>
                  )}
                </FormControl>
              )}

              {/* Selected Categories & Services Display */}
              {Object.keys(selectedServicesByCategory).length > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50 h-48 overflow-y-auto">
                  <h4 className="font-medium text-gray-700 mb-2">Selected Categories & Services</h4>
                  {Object.entries(selectedServicesByCategory).map(([catId, services]) => {
                    const catName = categories.find((c) => c.id === parseInt(catId))?.name || "Unknown Category";
                    const serviceNames = services
                      .map((id) => serviceOptions.find((s) => s.id === id)?.service_name)
                      .filter(Boolean)
                      .join(", ") || "No services selected";

                    return (
                      <div key={catId} className="mb-2 p-2 border-b last:border-b-0">
                        <p className="font-semibold">{catName}</p>
                        <p className="text-sm text-gray-600">{serviceNames}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Debug Info - Remove in production */}
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Debug Info:</strong> Selected Category: {selectedCategory} | 
                  Filtered Services Count: {filteredServiceOptions.length} | 
                  All Services Count: {serviceOptions.length}
                </p>
              </div>

              {/* Add Custom Service Button */}
              {!showCustomSection && (
                <button
                  onClick={triggerCustomService}
                  className="w-full py-2 border-2 border-dashed border-gray-500 text-gray-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
                >
                  <AddIcon /> Add Custom Service
                </button>
              )}

              {/* Custom Services Section - Full Fields */}
              {showCustomSection && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Custom Services</h4>
                    <button
                      onClick={addCustomService}
                      className="text-blue-600 text-sm flex items-center gap-1"
                    >
                      <AddIcon fontSize="small" /> Add More
                    </button>
                  </div>

                  {customServices.map((cs, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3 items-end">
                      <TextField
                        label="Service Name *"
                        value={cs.name}
                        onChange={(e) => handleCustomServiceChange(index, "name", e.target.value)}
                        size="small"
                        fullWidth
                        required
                      />
                      <TextField
                        label="Price *"
                        value={cs.price}
                        onChange={(e) => handleCustomServiceChange(index, "price", e.target.value)}
                        type="number"
                        size="small"
                        fullWidth
                        required
                      />
                      <TextField
                        label="Hours *"
                        value={cs.hours}
                        onChange={(e) => handleCustomServiceChange(index, "hours", e.target.value)}
                        type="number"
                        size="small"
                        fullWidth
                        required
                      />
                      <TextField
                        label="Minutes *"
                        value={cs.minutes}
                        onChange={(e) => handleCustomServiceChange(index, "minutes", e.target.value)}
                        type="number"
                        size="small"
                        fullWidth
                        required
                      />
                      <div className="flex gap-1">
                        <TextField
                          label="Seating"
                          value={cs.seating}
                          onChange={(e) => handleCustomServiceChange(index, "seating", e.target.value)}
                          type="number"
                          size="small"
                          fullWidth
                        />
                        {customServices.length > 1 && (
                          <IconButton onClick={() => removeCustomService(index)} color="error">
                            <RemoveIcon />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setShowCustomSection(false);
                      setCustomServices([]);
                    }}
                    className="text-red-600 text-sm underline"
                  >
                    Remove Custom Services
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <TextField label="Actual Price" value={formData.actual_price} disabled fullWidth />
                <TextField
                  label="Discount Price *"
                  name="discounted_price"
                  value={formData.discounted_price}
                  onChange={handleChange}
                  type="number"
                  required
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <TextField
                  label="Hours"
                  name="serviceHours"
                  value={formData.serviceHours}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
                <TextField
                  label="Minutes"
                  name="serviceMinutes"
                  value={formData.serviceMinutes}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
                <TextField
                  label="Seating"
                  name="serviceSeating"
                  value={formData.serviceSeating}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Package Images</h4>
                <button
                  onClick={() => setOpenImageModal(true)}
                  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add Images
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {packageImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img.preview} alt="preview" className="w-full h-32 object-cover rounded" />
                      <p>{categories.find((c) => c.id === img.categoryId)?.name}</p>
                      <IconButton
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0"
                        color="error"
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleClose}
                  className="px-5 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  {editMode ? "Update" : "Add"} Package
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </Modal>

      <Modal open={openImageModal} onClose={() => setOpenImageModal(false)}>
        <div className="flex items-center justify-center h-full p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <h3 className="text-lg font-bold mb-4">Upload Images to Category</h3>
            <FormControl fullWidth className="mb-4">
              <InputLabel>Select Category</InputLabel>
              <Select value={tempCategory} onChange={(e) => setTempCategory(e.target.value)}>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setTempFiles(Array.from(e.target.files))}
              className="mb-4"
            />
            {tempFiles.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Selected Images Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
                  {tempFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <p className="text-sm truncate">{file.name}</p>
                      <IconButton
                        onClick={() => removeTempImage(index)}
                        className="absolute top-0 right-0"
                        color="error"
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenImageModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddImages}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={openDetailsModal} onClose={handleCloseDetails}>
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center h-full p-4"
        >
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Package Details</h2>
              <CloseIcon onClick={handleCloseDetails} className="cursor-pointer" />
            </div>
            {selectedPackage ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold">Package Name:</h3>
                  <p>{selectedPackage.package_name}</p>
                </div>
                <div>
                  <h3 className="font-bold">Actual Price:</h3>
                  <p>₹{selectedPackage.actual_price}</p>
                </div>
                <div>
                  <h3 className="font-bold">Discounted Price:</h3>
                  <p>₹{selectedPackage.discounted_price}</p>
                </div>
                <div>
                  <h3 className="font-bold">Package Time:</h3>
                  <p>Hours: {selectedPackage.package_time?.hours}, Minutes: {selectedPackage.package_time?.minutes}, Seating: {selectedPackage.package_time?.seating}</p>
                </div>
                <div>
                  <h3 className="font-bold">Request Date:</h3>
                  <p>{dayjs(selectedPackage.created_at).format("DD-MM-YYYY")}</p>
                </div>
                <div>
                  <h3 className="font-bold">Status:</h3>
                  <p>{selectedPackage.status}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Services:</h3>
                  <table className="w-full border-collapse bg-white rounded-lg text-left">
                    <thead>
                      <tr>
                        <th className="border border-gray-200 p-2">Category</th>
                        <th className="border border-gray-200 p-2">Service Name</th>
                        <th className="border border-gray-200 p-2">Price</th>
                        <th className="border border-gray-200 p-2">Hours</th>
                        <th className="border border-gray-200 p-2">Minutes</th>
                        <th className="border border-gray-200 p-2">Days</th>
                        <th className="border border-gray-200 p-2">Seating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getAllServices(selectedPackage.services_included).map((s, index) => (
                        <tr key={index}>
                          <td className="border border-gray-200 p-2">{s.category}</td>
                          <td className="border border-gray-200 p-2">{s.name}</td>
                          <td className="border border-gray-200 p-2">₹{s.price}</td>
                          <td className="border border-gray-200 p-2">{s.hours}</td>
                          <td className="border border-gray-200 p-2">{s.minutes}</td>
                          <td className="border border-gray-200 p-2">{s.days}</td>
                          <td className="border border-gray-200 p-2">{s.seating}</td>
                        </tr>
                      ))} 
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-32">
                <CircularProgress sx={{ color: "#000" }} />
              </div>
            )}
          </div>
        </motion.div>
      </Modal>
    </>
  );
};

export default PackagesRequest;