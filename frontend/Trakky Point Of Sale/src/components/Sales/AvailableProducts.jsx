import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaRupeeSign, FaFileCsv, FaDownload, FaUpload } from "react-icons/fa";

// Icons (you can replace these with your own icon components or SVGs)
const DeleteIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const AddIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const BackIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const UploadIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
    />
  </svg>
);

const LoadingSpinner = () => (
  <div className="w-6 h-6 border-2 border-[#492DBD] border-t-transparent rounded-full animate-spin"></div>
);

const AvailableProducts = () => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens?.access_token;
  const navigate = useNavigate();
  const tableRef = useRef(null);

  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [productCodes, setProductCodes] = useState([]);
  const [search, setSearch] = useState("");
  const [pinSearch, setPinSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [csvLoading, setCsvLoading] = useState(false);
  const [filterData, setFilteredData] = useState([]);
  const [suppData, setSuppData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showCustomBrand, setShowCustomBrand] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [csvFile, setCsvFile] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    product_name: "",
    supplier_Barcode: "",
    supplier: "",
    product_brand: "",
    measure_unit: "",
    measure_amount: "",
    supply_price: "",
    retail_price: "",
    tax: "",
    low_stock_level: "",
    short_description: "",
    product_description: "",
    pin: "",
    product_img: null,
  });

  // Safe fetch function wrapper
  const safeFetch = async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(`Error fetching data: ${error.message}`);
      return null;
    }
  };

  // Fetch product data with error handling
  const FetchProductDatas = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    setLoading(true);
    try {
      const data = await safeFetch(
        "https://backendapi.trakky.in/salonvendor/product/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (data) {
        const sortedData = Array.isArray(data)
          ? data.sort((a, b) => b.id - a.id)
          : [];
        setProductCodes(sortedData);
        setFilteredData(sortedData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch suppliers with error handling
  const fetchSupplier = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    const data = await safeFetch(
      "https://backendapi.trakky.in/salonvendor/supplier/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    setSuppData(Array.isArray(data) ? data : []);
  };

  // Fetch brands with error handling
  const fetchBrands = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    const data = await safeFetch(
      "https://backendapi.trakky.in/salonvendor/brands/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    setBrands(Array.isArray(data) ? data : []);
  };

  // Initial data fetching
  useEffect(() => {
    if (token) {
      FetchProductDatas();
      fetchSupplier();
      fetchBrands();
    }
  }, [token]);

  // Search functionality with safety checks
  useEffect(() => {
    if (!Array.isArray(productCodes)) return;

    const filtered = productCodes.filter((item) => {
      const matchesName =
        search === "" ||
        item?.product_name?.toLowerCase().includes(search.toLowerCase());
      const matchesPin =
        pinSearch === "" ||
        item?.product_indentification_number
          ?.toLowerCase()
          .includes(pinSearch.toLowerCase());
      return matchesName && matchesPin;
    });

    const sortedFiltered = [...filtered].sort((a, b) => b.id - a.id);
    setFilteredData(sortedFiltered || []);

    if ((search || pinSearch) && tableRef.current) {
      setTimeout(() => {
        tableRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [search, pinSearch, productCodes]);

  // Delete product with confirmation
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/product/${productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        setFilteredData((prev) =>
          prev.filter((product) => product?.id !== productId),
        );
        toast.success("Product deleted successfully");
        FetchProductDatas();
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Modal handlers
  const handleOpen = (product = null) => {
    setEditProductData(product);
    setActiveStep(0);
    resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // CSV Modal handlers
  const handleCsvModalOpen = () => {
    setCsvModalOpen(true);
    setCsvFile(null);
  };

  const handleCsvModalClose = () => {
    setCsvModalOpen(false);
    setCsvFile(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, product_img: file }));
      setImagePreview(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, product_img: "" }));
    setImagePreview(null);
  };

  const handleEditOpen = (product) => {
    if (!product) return;

    setEditProductData(product);
    setFormData({
      product_name: product.product_name || "",
      supplier_Barcode: product.supplier_Barcode || "",
      supplier: product.supplier || "",
      product_brand: product.product_brand || "",
      measure_unit: product.measure_unit || "",
      measure_amount: product.measure_amount || "",
      supply_price: product.supply_price || "",
      retail_price: product.retail_price || "",
      tax: product.tax || "",
      low_stock_level: product.low_stock_level || "",
      short_description: product.short_description || "",
      product_description: product.product_description || "",
      pin: product.product_indentification_number || "",
      product_img: null,
    });

    setImagePreview(product.product_img || null);
    setOpen(true);
  };

  // CSV File handlers
  const handleCsvFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setCsvFile(file);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleCsvSubmit = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file to upload");
      return;
    }

    setCsvLoading(true);

    // Prepare FormData
    const formData = new FormData();
    formData.append("file", csvFile); // backend field name

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/import-products-data/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // do NOT set Content-Type manually
          },
          body: formData,
        },
      );

      const data = await response.json(); // always parse JSON

      if (!response.ok) {
        // Backend returned an error
        throw new Error(data.error || "Failed to upload CSV file");
      }

      // Success handling
      if (data.success) {
        // Check if any products were skipped
        if (data.skipped_rows && data.skipped_rows.length > 0) {
          toast(
            <div className="bg-yellow-50">
              <strong>Data Was Not Imported rows:</strong>
              <ul>
                {data.skipped_rows.slice(0, 5).map((row, index) => (
                  <li key={index}>{row}</li>
                ))}
                {data.skipped_rows.length > 5 && (
                  <li>
                    ...and {data.skipped_rows.length - 5} more rows skipped
                  </li>
                )}
              </ul>
            </div>,
            { duration: 6000 }, // show longer for multiple rows
          );
        } else {
          toast.success(data.message || "Products uploaded successfully!");
        }

        handleCsvModalClose();
        FetchProductDatas();
      } else {
        // If backend says success: false
        throw new Error(data.message || "Failed to upload CSV file");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setCsvLoading(false);
    }
  };

  // Download sample CSV
  const downloadSampleCsv = () => {
    const sampleData = [
      [
        "product_name",
        "supplier_Barcode",
        "supplier",
        "product_brand",
        "measure_unit",
        "measure_amount",
        "supply_price",
        "retail_price",
        "tax",
        "low_stock_level",
        "short_description",
        "product_description",
        "pin",
        "image",
      ],
      [
        "Sample Product 111111",
        "BARCODE001",
        "1",
        "1",
        "ml",
        "500",
        "100.00",
        "150.00",
        "18",
        "50",
        "Short description 1",
        "Full product description 1",
        "PIN-001",
        "image1.jpg",
      ],
      [
        "Sample Product 222222",
        "BARCODE002",
        "1",
        "1",
        "g",
        "1000",
        "200.00",
        "250.00",
        "12",
        "100",
        "Short description 2",
        "Full product description 2",
        "PIN-002",
        "image2.jpg",
      ],
      [
        "Sample Product 333333",
        "BARCODE003",
        "1",
        "1",
        "kg",
        "5",
        "500.00",
        "600.00",
        "5",
        "10",
        "Short description 3",
        "Full product description 3",
        "PIN-003",
        "image3.jpg",
      ],
    ];

    const csvContent = sampleData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_sample_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Sample CSV downloaded!");
  };

  // Form handlers
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrandChange = (event) => {
    const value = event.target.value;
    if (value === "custom") {
      setShowCustomBrand(true);
      return;
    }
    setFormData((prev) => ({ ...prev, product_brand: value }));
  };

  const resetForm = () => {
    setFormData({
      product_name: "",
      supplier_Barcode: "",
      supplier: "",
      product_brand: "",
      measure_unit: "",
      measure_amount: "",
      supply_price: "",
      retail_price: "",
      tax: "",
      low_stock_level: "",
      short_description: "",
      product_description: "",
      pin: "",
      product_img: "",
    });
    setEditProductData(null);
    setShowCustomBrand(false);
    setImagePreview(null);
  };

  // Stepper configuration
  const steps = ["Basic Info", "Pricing & Measure", "Product Description"];
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Submit form with validation
  const handleSubmit = async () => {
    if (!formData.product_name) {
      toast.error("Product name is required");
      return;
    }

      let branchId = localStorage.getItem("branchId") || "";


    const formDataToSend = new FormData();
    formDataToSend.append("product_name", formData.product_name);
    // formDataToSend.append("branchId", branchId);
    formDataToSend.append(
      "short_description",
      formData.short_description || "",
    );
    formDataToSend.append(
      "product_description",
      formData.product_description || "",
    );
    formDataToSend.append(
      "supply_price",
      parseFloat(formData.supply_price) || 0,
    );
    formDataToSend.append(
      "retail_price",
      parseFloat(formData.retail_price) || 0,
    );
    formDataToSend.append("tax", formData.tax || "0");
    formDataToSend.append("supplier", formData.supplier || "");
    formDataToSend.append("product_brand", formData.product_brand || "");
    formDataToSend.append("low_stock_level", formData.low_stock_level || "0");
    formDataToSend.append("measure_amount", formData.measure_amount || "0");
    formDataToSend.append("product_indentification_number", formData.pin || "");
    formDataToSend.append("measure_unit", formData.measure_unit || "");

    if (formData.product_img instanceof File) {
      formDataToSend.append("product_img", formData.product_img);
    }

    try {
      const endpoint = editProductData
        ? `https://backendapi.trakky.in/salonvendor/product/${editProductData.id}/`
        : "https://backendapi.trakky.in/salonvendor/product/";

      const method = editProductData ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success(editProductData ? "Product updated" : "Product added");
        setOpen(false);
        FetchProductDatas();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.product_img?.[0] || "Failed to save product");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  // Create new brand with validation
  const createBrand = async (brandName) => {
    if (!brandName) {
      toast.error("Brand name is required");
      return;
    }

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/brands/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: brandName }),
        },
      );

      if (response.ok) {
        fetchBrands();
        toast.success("Brand added");
        setShowCustomBrand(false);
      } else {
        throw new Error("Failed to add brand");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Generate SKU safely
  const generateUniqueSKU = async (name) => {
    if (!name) {
      toast.error("Product name is required");
      return;
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/generate-pun/?name=${encodeURIComponent(
          name,
        )}`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, pin: data.pun || "" }));
      } else {
        throw new Error("Failed to generate SKU");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const ProductsIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );

  const PriceIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 4h12M6 8h12M10 8c0 5 4 7 8 7H6"
      />
    </svg>
  );

  const AlertIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  );

  const BrandIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );

  // Stats data
  const stats = [
    {
      title: "Total Products",
      value: Array.isArray(filterData) ? filterData.length : 0,
      change: "+12%",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: <ProductsIcon />,
    },
    {
      title: "Low Stock Items",
      value: Array.isArray(filterData)
        ? filterData.filter(
            (item) =>
              item?.low_stock_level &&
              item?.measure_amount &&
              parseFloat(item.measure_amount) <=
                parseFloat(item.low_stock_level),
          ).length
        : 0,
      change: "-2%",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      icon: <AlertIcon />,
    },
    {
      title: "Average Retail Price",
      value:
        Array.isArray(filterData) && filterData.length > 0
          ? `₹${(
              filterData.reduce(
                (sum, item) => sum + (parseFloat(item?.retail_price) || 0),
                0,
              ) / filterData.length
            ).toFixed(2)}`
          : "₹0.00",
      change: "+5%",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      icon: <FaRupeeSign />,
    },

    {
      title: "Unique Brands",
      value: Array.isArray(filterData)
        ? new Set(
            filterData
              .map((item) => item?.brand_name)
              .filter((brand) => brand !== undefined && brand !== null),
          ).size
        : 0,
      change: "+3%",
      color: "bg-gradient-to-r from-purple-500 to-[#492DBD]",
      icon: <BrandIcon />,
    },
  ];

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <select
                  name="supplier"
                  value={formData.supplier || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <option value="">Select Supplier</option>
                  {suppData?.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  placeholder="Enter Product Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                {imagePreview && (
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-16 w-16 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editProductData?.product_img
                    ? "Current image will be replaced with new upload"
                    : "Upload product image (optional)"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Barcode (Optional)
                </label>
                <input
                  type="text"
                  name="supplier_Barcode"
                  value={formData.supplier_Barcode}
                  onChange={handleChange}
                  placeholder="Enter Product Barcode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  name="product_brand"
                  value={formData.product_brand || ""}
                  onChange={handleBrandChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <option value="">Select Brand</option>
                  {brands?.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.name}
                    </option>
                  ))}
                  <option value="custom">Add Custom Brand</option>
                </select>
              </div>

              {showCustomBrand && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Brand Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="customBrand"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customBrand: e.target.value,
                        }))
                      }
                      placeholder="Enter custom brand name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => createBrand(formData.customBrand)}
                      className="px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Identification Number
              </label>
              <input
                type="text"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                placeholder="e.g. 'SIH-256545'"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => generateUniqueSKU(formData.product_name)}
                className="mt-2 text-[#492DBD] hover:text-purple-800 text-sm font-medium transition-colors"
              >
                Generate PIN Automatically
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Measure Unit
                </label>
                <select
                  name="measure_unit"
                  value={formData.measure_unit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <option value="">Select Unit</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="L">Liters (L)</option>
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="measure_amount"
                    value={formData.measure_amount}
                    onChange={handleChange}
                    placeholder="Enter Amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                  {formData.measure_unit && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {formData.measure_unit}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supply Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="supply_price"
                    value={formData.supply_price}
                    onChange={handleChange}
                    placeholder="Enter Supply Price"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retail Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="retail_price"
                    value={formData.retail_price}
                    onChange={handleChange}
                    placeholder="Enter Retail Price"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax (%)
                </label>
                <input
                  type="number"
                  name="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Level
                </label>
                <input
                  type="number"
                  name="low_stock_level"
                  value={formData.low_stock_level}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                placeholder="Enter short description"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                name="product_description"
                value={formData.product_description}
                onChange={handleChange}
                placeholder="Enter full product description"
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="">
            <h1 className="text-2xl md:text-2xl font-bold text-gray-900 border-l-4 border-[#492DBD] pl-3">
              Product Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage Your Inventory And Products
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <CloseIcon />
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by PIN..."
                value={pinSearch}
                onChange={(e) => setPinSearch(e.target.value)}
                className="w-full sm:w-64 pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              {pinSearch && (
                <button
                  onClick={() => setPinSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <CloseIcon />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCsvModalOpen}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <UploadIcon />
                Upload Bulk Products
              </button>
              <button
                onClick={() => handleOpen(null)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
              >
                <AddIcon />
                Add New Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`${stat.color} rounded-lg p-3 text-white shadow-md relative overflow-hidden`}
          >
            {/* Background pattern - smaller */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              {React.cloneElement(stat.icon, { className: "w-full h-full" })}
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium opacity-90">{stat.title}</h3>
                <div className="p-1.5 bg-white bg-opacity-20 rounded-md">
                  {React.cloneElement(stat.icon, { className: "w-4 h-4" })}
                </div>
              </div>

              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p
                className={`text-sm ${
                  stat.change.startsWith("+")
                    ? "text-green-200"
                    : "text-red-200"
                }`}
              >
                {stat.change} vs last month
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Products Table */}
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        ref={tableRef}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Product",
                  "Brand",
                  "Supplier",
                  "Supply Price",
                  "Retail Price",
                  "Quantity",
                  "PIN",
                  "Tax",
                  "Low Stock",
                  "Description",
                  "Image",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <LoadingSpinner />
                      <span className="ml-2 text-gray-600">
                        Loading products...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filterData?.length > 0 ? (
                filterData.map((item) => (
                  <tr
                    key={item?.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-[#492DBD] font-semibold">
                          {item?.product_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item?.product_name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item?.product_indentification_number || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item?.brand_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item?.supplier_data?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.supply_price || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.retail_price || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item?.measure_amount || item?.measure_unit ? (
                        <>
                          {item.measure_amount} {item.measure_unit}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.product_indentification_number || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.tax || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item?.low_stock_level &&
                          item?.measure_amount &&
                          parseFloat(item.measure_amount) <=
                            parseFloat(item.low_stock_level)
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item?.low_stock_level || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      {item.short_description || item.product_description ? (
                        <div className="space-y-1">
                          {item.short_description && (
                            <div className="line-clamp-2">
                              {item.short_description}
                            </div>
                          )}
                          {item.product_description &&
                            !item.short_description && (
                              <div className="line-clamp-3">
                                {item.product_description}
                              </div>
                            )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.product_img ? (
                        <img
                          src={item.product_img}
                          alt={item.product_name}
                          className="h-10 w-10 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditOpen(item)}
                          className="p-2 text-[#492DBD] hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(item?.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={12}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editProductData ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Stepper */}
              <div className="px-6 pt-6">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {steps.map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index <= activeStep
                            ? "bg-[#492DBD] text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          index <= activeStep
                            ? "text-[#492DBD]"
                            : "text-gray-500"
                        }`}
                      >
                        {step}
                      </span>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-12 h-0.5 mx-4 ${
                            index < activeStep ? "bg-[#492DBD]" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {renderStepContent(activeStep)}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    activeStep === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Back
                </button>

                {activeStep === steps.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {editProductData ? "Update Product" : "Create Product"}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSV Upload Modal */}
      <AnimatePresence>
        {csvModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upload Bulk Products via CSV*
                </h2>
                <button
                  onClick={handleCsvModalClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {/* File Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload CSV File *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-2 text-center">
                        <div className="flex flex-col items-center justify-center text-center">
                          <UploadIcon className="h-12 w-12 text-gray-400" />

                          <div className="flex text-sm text-gray-600 mt-2">
                            <label
                              htmlFor="csv-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-[#492DBD] hover:text-purple-700 focus-within:outline-none"
                            >
                              <span>Upload a CSV file</span>
                              <input
                                id="csv-upload"
                                name="csv-upload"
                                type="file"
                                accept=".csv"
                                onChange={handleCsvFileUpload}
                                className="sr-only"
                              />
                            </label>

                            <p className="pl-1">or drag and drop</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          CSV files up to 10MB
                        </p>
                        {csvFile && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-800 font-medium">
                              File selected: {csvFile.name}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              Size: {(csvFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Required Format Section */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">
                      Must Required CSV Format:
                    </h3>
                    <div className="text-sm text-blue-700 space-y-2">
                      <p>• CSV must contain these columns in order:</p>
                      <div className="ml-4">
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            product_name
                          </code>{" "}
                          (required)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            supplier_Barcode
                          </code>{" "}
                          (optional)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            supplier
                          </code>{" "}
                          (supplier ID)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            product_brand
                          </code>{" "}
                          (brand ID)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            measure_unit
                          </code>{" "}
                          (ml, L, g, kg)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            measure_amount
                          </code>{" "}
                          (number)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            supply_price
                          </code>{" "}
                          (number)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            retail_price
                          </code>{" "}
                          (number)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            tax
                          </code>{" "}
                          (percentage)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            low_stock_level
                          </code>{" "}
                          (number)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            short_description
                          </code>{" "}
                          (optional)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            product_description
                          </code>{" "}
                          (optional)
                        </p>
                        <p>
                          <code className="bg-white px-2 py-1 rounded text-sm">
                            pin
                          </code>{" "}
                          (optional)
                        </p>
                      </div>
                      <p className="mt-3">• First row must be column headers</p>
                      <p>
                        • Ensure supplier and brand IDs exist in your system
                      </p>
                    </div>
                  </div>

                  {/* Sample CSV Download */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-purple-800 mb-2">
                      Need a template?
                    </h3>
                    <p className="text-sm text-purple-700 mb-3">
                      Download our sample CSV template to get started with the
                      correct format.
                    </p>
                    <button
                      onClick={downloadSampleCsv}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      <FaDownload className="w-4 h-4" />
                      Download Sample CSV
                    </button>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">
                      Important Notes:
                    </h3>
                    <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                      <li>Maximum 1000 products per CSV file</li>
                      <li>
                        All prices should be in numbers only (no currency
                        symbols)
                      </li>
                      <li>Image uploads are not supported via CSV import</li>
                      <li>Products with errors will be skipped</li>
                      <li>You'll receive a summary after upload completes</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <button
                  onClick={downloadSampleCsv}
                  className="flex items-center gap-2 px-4 py-2 text-[#492DBD] hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <FaFileCsv className="w-5 h-5" />
                  Download Template
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleCsvModalClose}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCsvSubmit}
                    disabled={!csvFile || csvLoading}
                    className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      !csvFile || csvLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {csvLoading ? (
                      <>
                        <LoadingSpinner />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="w-4 h-4" />
                        Upload CSV
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvailableProducts;
