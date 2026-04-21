import React, { useState, useContext, useEffect } from "react";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import AuthContext from "../../Context/Auth";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import { Delete, Edit } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const AvailableProducts = () => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [editDistribution, setEditDistribution] = useState(null);

  const [open, setOpen] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [productCodes, setProductCodes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterData, setFilteredData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [suppData, setSuppData] = useState([]);
  const [DeliverTo, setDeliverTo] = useState([]);
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
  });

  const confirm = useConfirm();


  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/product/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        setProductCodes(responseData);
        
      } else {
        console.log("error fetching data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
    fetchProductData();
  }, [token]);

  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/spavendor/supplier/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setSuppData(responseData);
        } else {
          console.log("Error while fetching data");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
    fetchBrands();
  }, [token]);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const resetSearch = () => {
    setSearch("");
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/product/${productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setFilteredData(
          filterData.filter((product) => product.id !== productId)
        );
        toast.success("Product deleted successfully");
        fetchProductData();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
      console.log(error);
    }
  };

  const handleDeleteConfirmation = (id) => {
    confirm({ description: "Are you sure you want to delete this supplier?" })
      .then(() => handleDelete(id))
      .catch(() => console.log("Deletion cancelled."));
  };

  useEffect(() => {
    if (search === "") {
      setFilteredData(productCodes);
    } else {
      setFilteredData(
        productCodes.filter((item) =>
          item.product_name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, productCodes]);

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

  const handleEditOpen = (product) => {
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
    });
    setOpen(true);
    setActiveStep(0);
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Create a FormData object for the payload

    // product_name:idk
    // short_description: what all is required
    // product_description: god noes
    // supply_price: 200.6
    // retail_sales: 100.6
    // tax: 18.4
    // supplier: 19
    // product_brand: 1
    // low_stock_level: 2
    // measure_amount: 1000
    // product_indentification_number: 22990
    // measure_unit:ml

    const formDataToSend = new FormData();
    formDataToSend.append("product_name", formData.product_name);
    formDataToSend.append("short_description", formData.short_description);
    formDataToSend.append("product_description", formData.product_description);
    formDataToSend.append("supply_price", parseInt(formData.supply_price));
    formDataToSend.append("retail_price", parseInt(formData.retail_price));
    formDataToSend.append("tax", formData.tax);
    formDataToSend.append("supplier", formData.supplier);
    formDataToSend.append("product_brand", formData.product_brand);
    formDataToSend.append("low_stock_level", formData.low_stock_level);
    formDataToSend.append("measure_amount", formData.measure_amount);
    formDataToSend.append("product_indentification_number", formData.pin);
    formDataToSend.append("measure_unit", formData.measure_unit);

    try {
      const endpoint = editProductData
        ? `https://backendapi.trakky.in/spavendor/product/${editProductData.id}/`
        : "https://backendapi.trakky.in/spavendor/product/";

      const method = editProductData ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          editProductData
            ? "Product updated successfully"
            : "Product added successfully"
        );
        setOpen(false);
        fetchProductData();
      } else {
        const errorData = await response.json();
        toast.error(
          `Error: ${
            errorData.detail ||
            "There was an error while submitting the product"
          }`
        );
      }
    } catch (error) {
      toast.error("An error occurred while submitting the product");
    }
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
    });
    setEditProductData(null);
  };

  const steps = editDistribution
    ? ["Edit Basic Info", "Edit Pricing & Measure", "Edit Product Description"]
    : ["Basic Info", "Pricing & Measure", "Product Description"];

  const handleNext = () => setActiveStep((preActiveStep) => preActiveStep + 1);
  const handleBack = () => setActiveStep((preActiveStep) => preActiveStep - 1);

  const handleBrandChange = (event) => {
    const value = event.target.value;
    if (value === "custom") {
      setShowCustomBrand(true);
      return;
    }
    setFormData((prev) => ({ ...prev, product_brand: value }));
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/brands/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      } else {
        toast.error("Failed to fetch brands");
      }
    } catch (error) {
      toast.error("An error occurred while fetching brands");
      console.log(error);

      return null;
    }
  };

  const createBrand = async (brandName) => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/brands/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: brandName }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        fetchBrands();
        toast.success("Brand added successfully");
        setShowCustomBrand(false);
      } else {
        toast.error("Failed to add brand");
      }
    } catch (error) {
      toast.error("An error occurred while adding the brand");
      console.log(error);

      return null;
    }
  };

  const generateUniqueSKU = async (name) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/generate-pun/?name=${name}`,
        {
          method: "POST",
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, pin: data.pun }));
      } else {
        toast.error("Failed to generate SKU");
      }
    } catch (error) {
      toast.error("An error occurred while generating SKU");
      console.log(error);

      return null;
    }
  };

  const [showCustomBrand, setShowCustomBrand] = useState(false);

  const [brands, setBrands] = useState([]);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="w-full max-w-[768px] space-y-6 px-5 py-5 rounded-lg">
            <div className="space-y-4 bg-white p-5 rounded-lg">
              <div className="flex flex-wrap gap-4">
                <span className="flex flex-col w-full md:w-[calc(50%-8px)]">
                  <TextField
                    name="product_name"
                    value={formData.product_name}
                    label="Product Name"
                    onChange={handleChange}
                    placeholder="Enter Product Name"
                    variant="outlined"
                    className="w-full"
                  />
                </span>
                <span className="flex flex-col w-full md:w-[calc(50%-8px)]">
                  <TextField
                    name="supplier_Barcode"
                    value={formData.supplier_Barcode}
                    onChange={handleChange}
                    label="Product Barcode (Optional)"
                    placeholder="Enter Product Barcode"
                    variant="outlined"
                    className="w-full"
                  />
                </span>
                <span className="flex flex-col w-full md:w-[calc(50%-8px)]">
                  <FormControl fullWidth>
                    <InputLabel id="supplier-label">Supplier</InputLabel>
                    <Select
                      labelId="supplier-label"
                      label="Supplier"
                      name="supplier"
                      value={formData.supplier || ""}
                      onChange={handleChange}
                    >
                      {suppData.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </span>
                <span className="flex flex-col w-full md:w-[calc(50%-8px)]">
                  <FormControl fullWidth>
                    <InputLabel id="brand-label">Select Brand</InputLabel>
                    <Select
                      labelId="brand-label"
                      label="Select Brand"
                      name="product_brand"
                      value={formData.product_brand || ""}
                      onChange={handleBrandChange}
                    >
                      {brands.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                      <MenuItem value="custom">Add Custom Brand</MenuItem>
                    </Select>
                  </FormControl>
                </span>
                {showCustomBrand && (
                  <span className="flex items-center w-full">
                    <TextField
                      name="customBrand"
                      value={formData.customBrand}
                      onChange={handleChange}
                      label="Custom Brand"
                      placeholder="Enter Custom Brand"
                      variant="outlined"
                      className="w-full"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                if (!formData.customBrand) {
                                  toast.error(
                                    "Please enter a brand name first"
                                  );
                                  return;
                                }

                                createBrand(formData.customBrand);
                              }}
                              edge="end"
                            >
                              <AddCircleIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </span>
                )}
              </div>

              <TextField
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                label="Product identification number"
                placeholder="e.g. 'SIH-256545'"
                variant="outlined"
                className="w-[100%]"
                focused
              />

              {/* Generate SKU Button */}
              <div className="flex justify-start cursor-pointer">
                <p
                  className="text-purple-500"
                  onClick={() => {
                    if (!formData.product_name) {
                      toast.error("Please enter a product name first");
                      return;
                    }
                    generateUniqueSKU(formData.product_name);
                  }}
                >
                  Generate PIN Automatically
                </p>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="w-full max-w-[786px] space-y-6 px-5 py-5 rounded-lg">
            <div className="space-y-4 p-5 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                {/* Measure Dropdown */}
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Measure</InputLabel>
                  <Select
                    name="measure_unit"
                    value={formData.measure_unit}
                    onChange={handleChange}
                    label="Measure"
                    
                  >
                    <MenuItem value="ml">Milliliters (ml)</MenuItem>
                    <MenuItem value="L">Liters (L)</MenuItem>
                    <MenuItem value="g">Grams (g)</MenuItem>
                    <MenuItem value="kg">Kilograms (kg)</MenuItem>
                  </Select>
                </FormControl>

                {/* Amount Input with Conditional End Adornment for ml only */}
                <TextField
                  name="measure_amount"
                  value={formData.measure_amount}
                  onChange={handleChange}
                  label="Amount"
                  type="number"
                  placeholder="Enter Amount"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment:
                      formData.measure_unit === "ml" ? (
                        <InputAdornment position="start">ml</InputAdornment>
                      ) : formData.measure_unit === "L" ? (
                        <InputAdornment position="start">L</InputAdornment>
                      ) : formData.measure_unit === "g" ? (
                        <InputAdornment position="start">g</InputAdornment>
                      ) : formData.measure_unit === "kg" ? (
                        <InputAdornment position="start">kg</InputAdornment>
                      ) : null,
                  }}
                />
              </div>

              
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  name="supply_price"
                  value={formData.supply_price}
                  onChange={handleChange}
                  label="Supply Price"
                  placeholder="Enter Supply Price"
                  variant="outlined"
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">INR</InputAdornment>
                    ),
                  }}
                />

                {/* Retail Price Input */}
                <TextField
                  name="retail_price"
                  value={formData.retail_price}
                  onChange={handleChange}
                  label="Retail Price"
                  placeholder="Enter Retail Price"
                  variant="outlined"
                  type="number"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">INR</InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  name="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  label="tax"
                  type="number"
                  placeholder="0"
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  name="low_stock_level"
                  value={formData.low_stock_level}
                  onChange={handleChange}
                  label="Low stock level"
                  placeholder="0"
                  type="number"
                  variant="outlined"
                  focused={formData.stock}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <span
                          className="cursor-pointer"
                          onClick={() =>
                            setFormData({ ...formData, stock: 10 })
                          }
                        >
                          Default
                        </span>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-full max-w-[786px] space-y-6 px-5 py-5 rounded-lg">
            <div className="space-y-4 bg-white p-5 rounded-lg">
              <span className="flex flex-col">
                <TextField
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  label="Short Description"
                  placeholder="Enter Short Description"
                  variant="outlined"
                  className="w-full"
                />
              </span>
              <span className="flex flex-col">
                <TextField
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleChange}
                  label="Description"
                  placeholder="Full description"
                  multiline
                  rows={2}
                  variant="outlined"
                  className="w-full"
                />
              </span>
            </div>
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div className=" w-full h-full bg-[#EFECFF]">
      <Toaster />
      <div class="flex items-center justify-between h-14 w-full md:h-16 px-2 md:px-6">
        <div class="h-5 w-5 flex items-center md:hidden">
          <ArrowBackIcon className="w-full" />
        </div>
        <div>
          <h1 class="text-lg font-bold md:text-xl">Products Menu</h1>
        </div>
        {window.innerWidth > 768 ? (
          <div class="flex gap-3 items-center">
            <button
              class="rounded-md bg-black text-white px-4 py-2 text-sm"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleOpen(null);
              }}
            >
              Add product
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <button className="rounded-md border border-gray-300 p-1 ">
              <MoreVertIcon className="h-5 w-5" />
            </button>
            <button
              className="rounded-md border border-gray-300 p-1"
              onClick={() => {
                handleOpen(null);
              }}
            >
              <AddIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className=" w-full  h-[calc(100%-60px)] md:h-[calc(100%-68px)]  mt-1 ">
        <div className=" w-full h-full flex flex-col gap-2">
          <div className=" w-full h-14 px-3 flex py-2 gap-2 shrink-0">
            <input
              type="text"
              name="search"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className=" shrink grow h-full w-full max-w-[min(100%,400px)] rounded-xl outline-none active:outline-none focus:outline-none px-4"
              placeholder="Product name..."
            />
            <button
              onClick={resetSearch}
              className=" bg-[#512DC8] h-full w-20 flex items-center justify-center text-center text-sm text-white rounded-xl border-2 border-[#EFECFF]"
            >
              Reset
            </button>
          </div>

          <div className="w-full h-full pb-2 px-4  max-w-[100vw] md:max-w-[calc(100vw-288px)] overflow-auto">
            <table className=" border-collapse w-full bg-white rounded-lg text-center min-w-max">
              <tr>
                <th className=" border border-gray-200 p-2">Product name</th>
                <th className=" border border-gray-200 p-2">Brand Name</th>
                <th className=" border border-gray-200 p-2">Distributor</th>
                <th className=" border border-gray-200 p-2">Supply Price</th>
                <th className=" border border-gray-200 p-2">Retail Price</th>
                <th className=" border border-gray-200 p-2">
                  Quantity ( per unit )
                </th>
                <th className=" border border-gray-200 p-2">
                  Identificatin no.
                </th>
                <th className=" border border-gray-200 p-2">Tax ( approx )</th>
                <th className=" border border-gray-200 p-2">low stock level</th>
                <th className=" border border-gray-200 p-2">Short Desc.</th>
                <th className=" border border-gray-200 p-2">
                  Full Description
                </th>
                <th className=" border border-gray-200 p-2">Action</th>
              </tr>
              {loading ? (
                <tr className=" h-40 ">
                  <td colSpan="11" className=" mx-auto">
                    {" "}
                    <CircularProgress
                      sx={{
                        color: "#000",
                        margin: "auto",
                      }}
                    />
                  </td>
                </tr>
              ) : filterData?.length > 0 ? (
                filterData?.map((item) => {
                  return (
                    <tr key={item?.id}>
                      <td className=" border border-gray-200 p-2">
                        {item.product_name}
                      </td>
                      <td className=" border border-gray-200 p-2">
                        {item?.brand_name || "-"}
                      </td>
                      <td className=" border border-gray-200 p-2">
                        {item?.supplier_data?.name || "-"}
                      </td>

                      <td className=" border border-gray-200 p-2">
                        {item.supply_price || "-"}
                      </td>
                      <td className=" border border-gray-200 p-2">
                        {item.retail_price || "-"}
                      </td>
                      <td className=" border border-gray-200 p-2">
                        {item?.measure_amount || item?.measure_unit ? (
                          <>
                            {item.measure_amount} {item.measure_unit}
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className=" border border-gray-200 p-2">
                        {item.product_indentification_number || "-"}
                      </td>
                      <td className=" border border-gray-200 p-2">
                        {item.tax || "-"}
                      </td>

                      <td className=" border border-gray-200 p-2">
                        {item.low_stock_level || "-"}
                      </td>

                      <td className=" border border-gray-200 p-2 max-w-56">
                        {item.short_description || "-"}
                      </td>
                      <td className=" border border-gray-200 p-2 max-w-56">
                        {item.product_description || "-"}
                      </td>

                      <td className=" border border-gray-200 p-2">
                        <div className=" flex items-center justify-center h-full gap-2">
                          <button onClick={() => handleEditOpen(item)}>
                            <Edit />
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteConfirmation(item.id);
                            }}
                          >
                            <Delete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className=" p-2">
                    No data found
                  </td>
                </tr>
              )}
            </table>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {/* Framer Motion Box for the modal animation */}
        <motion.div
          initial={{ y: -30, opacity: 0 }} // Start position
          animate={{ y: 0, opacity: 1 }} // End position
          exit={{ y: 30, opacity: 0 }} // Close position
          transition={{ duration: 0.5 }} // Animation duration
        >
          <Box
            sx={{
              width: "800px",
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 24,
              outline: "none", // Removes focus outline
            }}
          >
            {/* Stepper with Green Completed Step */}
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step
                  key={label}
                  StepIconProps={{
                    sx: {
                      color: activeStep > index ? "#512dc820" : "inherit",
                      opacity: activeStep < index ? "0.5" : "1",
                    },
                  }}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Render Step Content */}
            <Box>{renderStepContent(activeStep)}</Box>

            {/* Buttons for Next, Back, and Submit */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                style={{ color: "black" }}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  style={{ background: "black" }}
                >
                  {editDistribution ? "Update" : "Finish"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  style={{ background: "black" }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </motion.div>
      </Modal>
    </div>
  );
};

export default AvailableProducts;
