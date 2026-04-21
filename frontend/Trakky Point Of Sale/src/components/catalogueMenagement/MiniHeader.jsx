import React, { useEffect, useState, useContext, useRef } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const MiniHeader = ({ title }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { authTokens, vendorData } = useContext(AuthContext);

  const allowedRoutes = [
    "/catalogue/category-request",
    "/catalogue/category-request/",
    "/catalogue/service-request",
    "/catalogue/service-request/",
    "/catalogue/type-membership",
    "/catalogue/type-membership/",
    "/catalogue/membership-customer",
    "/catalogue/membership-customer/",
  ];

  const routeButtonNames = {
    "/catalogue/category-request": "Add Category",
    "/catalogue/service-request": "Add Service",
    "/catalogue/type-membership": "Add Membership Type",
    "/catalogue/membership-customer": "Add Customer Membership",
  };

  const handleOpen = () => {
    const path = window.location.pathname;
    if (path === "/catalogue/category-request" || path === "/catalogue/service-request") {
      setOpen(true);
    } else if (path === "/catalogue/type-membership") {
      navigate("/catalogue/create-membership-type");
    } else if (path === "/catalogue/membership-customer") {
      navigate("/catalogue/create-customer-membership");
    }
  };

  const handleClose = () => setOpen(false);

  const handleToast = (msg, type) => {
    if (type === "error") {
      toast.error(msg);
    } else if (type === "success") {
      toast.success(msg);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-between h-14 w-full md:h-16 px-2 md:px-6">
        <div className="h-5 w-5 flex items-center md:hidden">
          <ArrowBackIcon
            className="w-full cursor-pointer"
            onClick={() => navigate("/catalogue")}
          />
        </div>
        <div>
          <h1 className="text-lg font-bold md:text-xl">{title}</h1>
        </div>

        {allowedRoutes.includes(window.location.pathname) && window.innerWidth > 768 ? (
          <div className="flex gap-3 items-center">
            <button
              className="rounded-md bg-black text-white px-4 py-2 text-sm"
              onClick={handleOpen}
            >
              {routeButtonNames[window.location.pathname] || "Add"}
            </button>
          </div>
        ) : (
          allowedRoutes.includes(window.location.pathname) && (
            <div className="flex gap-2 items-center">
              <button className="rounded-md border border-gray-300 p-1">
                <MoreVertIcon className="h-5 w-5" />
              </button>
              <button
                className="rounded-md border border-gray-300 p-1"
                onClick={handleOpen}
              >
                <AddIcon className="h-5 w-5" />
              </button>
            </div>
          )
        )}

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {window.location.pathname.includes("/catalogue/service-request") ? (
              <div className="bg-white max-w-[800px] p-[15px] rounded-xl flex flex-col gap-[20px] items-center w-full mx-4 max-h-[90vh] overflow-y-auto">
                <span
                  onClick={handleClose}
                  className="cursor-pointer w-full flex justify-end"
                >
                  <CloseIcon />
                </span>
                <ServiceModal
                  setOpen={setOpen}
                  handleToast={handleToast}
                  authTokens={authTokens}
                  vendorData={vendorData}
                />
              </div>
            ) : null}

            {window.location.pathname.includes("/catalogue/category-request") ? (
              <div className="bg-white w-full max-w-[700px] p-[15px] rounded-xl flex flex-col gap-[20px] items-center mx-4">
                <span
                  onClick={handleClose}
                  className="cursor-pointer w-full flex justify-end"
                >
                  <CloseIcon />
                </span>
                <CategoryModal
                  setOpen={setOpen}
                  handleToast={handleToast}
                  authTokens={authTokens}
                  vendorData={vendorData}
                />
              </div>
            ) : null}
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default MiniHeader;

// ==================== CATEGORY MODAL (Unchanged) ====================
const CategoryModal = ({ setOpen, handleToast, authTokens, vendorData }) => {
  const [selectedMasterCategory, setSelectedMasterCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [gender, setGender] = useState("");
  const [masterCategoryData, setMasterCategoryData] = useState([]);
  const [hidden, setHidden] = useState("none");
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };

  const handleSubmit = async () => {
    if (!selectedMasterCategory || !gender) {
      handleToast("Please select category and gender", "error");
      return;
    }

    setFormSubmitLoading(true);

    const payload = {
      from_master: selectedMasterCategory === "Other" ? false : true,
      category_name:
        selectedMasterCategory === "Other"
          ? newCategory
          : masterCategoryData.find((item) => item.id === selectedMasterCategory)?.name,
      gender: gender.toLowerCase(),
      salon: vendorData?.salon,
    };

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/category-request/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        handleToast("Category request submitted successfully", "success");
        setTimeout(() => {
          setNewCategory("");
          setSelectedMasterCategory("");
          setGender("");
          setOpen(false);
        }, 1500);
      } else if (response.status === 409) {
        const data = await response.json();
        handleToast(`Conflict: ${data?.category_name}`, "error");
      } else {
        handleToast(`Error: ${response.status}`, "error");
      }
    } catch (error) {
      handleToast("Network error", "error");
    } finally {
      setFormSubmitLoading(false);
    }
  };

  useEffect(() => {
    setHidden(selectedMasterCategory === "Other" ? "relative" : "none");
  }, [selectedMasterCategory]);

  useEffect(() => {
    const fetchMasterCategories = async () => {
      if (!vendorData?.salon) return;
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salonvendor/available-master-categories/?salon_id=${vendorData.salon}`
        );
        if (response.ok) {
          const data = await response.json();
          setMasterCategoryData(data);
        }
      } catch (error) {
        handleToast("Failed to load categories", "error");
      }
    };
    fetchMasterCategories();
  }, [vendorData?.salon]);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Master Category</InputLabel>
        <Select
          value={selectedMasterCategory}
          label="Master Category"
          MenuProps={MenuProps}
          onChange={(e) => {
            setSelectedMasterCategory(e.target.value);
            if (e.target.value !== "Other") {
              const selected = masterCategoryData.find((item) => item.id === e.target.value);
              setGender(selected?.gender?.charAt(0).toUpperCase() + selected?.gender?.slice(1));
            }
          }}
        >
          {masterCategoryData.map((item) => (
            <MenuItem value={item.id} key={item.id}>
              {item.name} ({item.gender})
            </MenuItem>
          ))}
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Category Name"
        variant="outlined"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        sx={{ width: "100%", display: hidden }}
      />

      <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Select
          value={gender}
          label="Gender"
          onChange={(e) => setGender(e.target.value)}
          disabled={selectedMasterCategory !== "Other"}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>

      <button
        className={`bg-black text-white w-full rounded-xl py-2.5 mt-3 ${
          formSubmitLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onClick={handleSubmit}
        disabled={formSubmitLoading}
      >
        {formSubmitLoading ? "Submitting..." : "Submit"}
      </button>
    </>
  );
};

// ==================== SIMPLIFIED SERVICE MODAL - DIRECT SERVICE NAME ENTRY ====================
const ServiceModal = ({ setOpen, handleToast, authTokens, vendorData }) => {
  const editorRef = useRef(null);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [timing, setTiming] = useState({ seating: "", hours: "", minutes: "" });
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  // Length Pricing States
  const [selectedLengthType, setSelectedLengthType] = useState("");
  const [lengthOptions, setLengthOptions] = useState({
    short: { checked: false, price: "" },
    medium: { checked: false, price: "" },
    long: { checked: false, price: "" },
    custom: { name: "", price: "", checked: false },
  });
  const [checkedLengths, setCheckedLengths] = useState([]);

  useEffect(() => {
    if (editorRef.current) return;
    editorRef.current = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "bullet" }, { list: "ordered" }],
          [{ color: [] }],
        ],
      },
    });
  }, []);

  // Length Handlers
  const handleLengthCheckboxChange = (type) => {
    const key = type.toLowerCase();
    if (key === "custom") return;

    setLengthOptions((prev) => {
      const updated = {
        ...prev,
        [key]: { ...prev[key], checked: !prev[key].checked },
      };
      updateCheckedLengths(updated);
      return updated;
    });
  };

  const handleLengthPriceChange = (type, value) => {
    const key = type.toLowerCase();
    setLengthOptions((prev) => {
      const updated = { ...prev, [key]: { ...prev[key], price: value } };
      updateCheckedLengths(updated);
      return updated;
    });
  };

  const handleCustomLengthChange = (name, price) => {
    setLengthOptions((prev) => {
      const updated = {
        ...prev,
        custom: { name, price, checked: name.trim() !== "" && price !== "" },
      };
      updateCheckedLengths(updated);
      return updated;
    });
  };

  const updateCheckedLengths = (options) => {
    const list = [];
    if (options.short.checked && options.short.price)
      list.push({ type: "Short", price: options.short.price, key: "short" });
    if (options.medium.checked && options.medium.price)
      list.push({ type: "Medium", price: options.medium.price, key: "medium" });
    if (options.long.checked && options.long.price)
      list.push({ type: "Long", price: options.long.price, key: "long" });
    if (options.custom.checked && options.custom.name && options.custom.price)
      list.push({ type: options.custom.name, price: options.custom.price, key: "custom" });

    setCheckedLengths(list);
  };

  const removeLength = (key) => {
    if (key === "custom") {
      setLengthOptions((prev) => ({
        ...prev,
        custom: { name: "", price: "", checked: false },
      }));
    } else {
      setLengthOptions((prev) => ({
        ...prev,
        [key]: { checked: false, price: "" },
      }));
    }
    setSelectedLengthType("");
  };

  const handleSubmit = async () => {
    if (!serviceName.trim()) {
      handleToast("Service name is required", "error");
      return;
    }

    setLoading(true);

    const payload = {
      salon: vendorData?.salon,
      from_masterservice: false,
      service_name: serviceName.trim(),
      price: servicePrice ? parseFloat(servicePrice) : null,
      description: editorRef.current.root.innerHTML,
      service_time: {
        hours: timing.hours ? parseInt(timing.hours) : 0,
        minutes: timing.minutes ? parseInt(timing.minutes) : 0,
        seating: timing.seating ? parseInt(timing.seating) : 0,
      },
      gender: gender?.toLowerCase() || null,
    
    };

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/service-request/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        handleToast("Service request submitted successfully!", "success");

        setTimeout(() => {
          setServiceName("");
          setServicePrice("");
          setTiming({ seating: "", hours: "", minutes: "" });
          setGender("");
          editorRef.current.root.innerHTML = "<p></p>";
          setSelectedLengthType("");
          setLengthOptions({
            short: { checked: false, price: "" },
            medium: { checked: false, price: "" },
            long: { checked: false, price: "" },
            custom: { name: "", price: "", checked: false },
          });
          setCheckedLengths([]);
          setOpen(false);
        }, 1500);
      } else if (response.status === 409) {
        const data = await response.json();
        handleToast(`Conflict: ${data.detail || "Service already requested"}`, "error");
      } else {
        handleToast(`Error: ${response.status}`, "error");
      }
    } catch (error) {
      handleToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-6 gap-5">
      {/* Direct Service Name Input */}
      <div className="col-span-6">
        <TextField
          label="Service Name"
          variant="outlined"
          fullWidth
          required
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Enter new service name directly"
        />
      </div>

      {/* Description */}
      <div className="col-span-6">
        <label className="block font-normal pb-2">Description (Optional)</label>
        <div id="editor" style={{ height: "120px" }}></div>
      </div>

      {/* Timing */}
      <div className="col-span-2">
        <TextField
          label="Hours"
          type="number"
          value={timing.hours}
          onChange={(e) => setTiming({ ...timing, hours: e.target.value })}
          inputProps={{ min: 0 }}
          onWheel={(e) => e.target.blur()}
        />
      </div>
      <div className="col-span-2">
        <TextField
          label="Minutes"
          type="number"
          value={timing.minutes}
          onChange={(e) => setTiming({ ...timing, minutes: e.target.value })}
          inputProps={{ min: 0 }}
          onWheel={(e) => e.target.blur()}
        />
      </div>
      <div className="col-span-2">
        <TextField
          label="Seating"
          type="number"
          value={timing.seating}
          onChange={(e) => setTiming({ ...timing, seating: e.target.value })}
          inputProps={{ min: 0 }}
          onWheel={(e) => e.target.blur()}
        />
      </div>

      {/* Base Price & Gender */}
      <div className="col-span-3">
        <TextField
          label="Base Price (Optional)"
          type="number"
          value={servicePrice}
          onChange={(e) => setServicePrice(e.target.value)}
          inputProps={{ min: 0 }}
          onWheel={(e) => e.target.blur()}
        />
      </div>

      <div className="col-span-3">
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            value={gender}
            label="Gender"
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>
      </div>

     

      {/* Submit Button */}
      <div className="col-span-6 text-center mt-6">
        <button
          className={`bg-[#512DC8] hover:bg-[#3a2199] text-white font-bold rounded-xl py-3 px-10 text-lg transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Service Request"}
        </button>
      </div>
    </div>
  );
};