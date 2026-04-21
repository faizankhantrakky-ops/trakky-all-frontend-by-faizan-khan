import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast, { Toaster } from "react-hot-toast";
import { Delete, Edit } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../../Context/Auth";
import CircularProgress from "@mui/material/CircularProgress";
import { useConfirm } from "material-ui-confirm";

import {
  Modal,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const InUseProduct = () => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [SuppData, setSuppData] = useState([]);
  const [useInventory, setUseInventory] = useState([]);
  const [filterListData, setFilterListData] = useState([]);
  const [editProductData, setEditProductData] = useState();
  const confirm = useConfirm();

  const [consumption, setConsumption] = useState("");
  const [date, setDate] = useState("");
  const [inputField, setInputField] = useState("");
  const [quantity, setQuantity] = useState("");

  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    consumption: "", // Add consumption field here
    measure_unit: "",
  });


  useEffect(() => {
    if (search === "") {
      setFilterData(useInventory);
    } else {
      setFilterData(
        useInventory.filter((item) =>
          item?.use_inventory_details?.product_details
        ?.product_name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, useInventory]);

  const handleChange = (event) => {
    const { name, value } = event.target; // Extract name and value from the event
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the field dynamically based on the name
    }));
  };

  useEffect(() => {
    if (useInventory.length > 0) {
      const selectProduct = useInventory.find(
        (item) => item.id === formData.product
      );
      if (selectProduct) {
        // setFormData((prevData) => ({
        //   ...prevData,
        //   quantity: selectProduct.quantity,
        // }));
      }
    }
  }, [formData.product, useInventory]);

  const UseInvertoryListData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/currentuse/",
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
        setFilterListData(responseData);
      } else {
        toast.error("Error while fetching data");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    UseInvertoryListData();
  }, [token]);

  useEffect(() => {
    UseInventoryData();
  }, [token]);

  const UseInventoryData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/use-inventory/",
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
        setUseInventory(responseData);
        setFilterData(responseData); // Set initial filter data
      } else {
        toast.error("Error while fetching data");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      product: "",
      quantity: "",
      consumption: "",
      measure_unit: "",
    });
  };

  const resetSearch = () => {
    setSearch("");
    setFilterData(SuppData);
  };

  const handleProductSelect = (e) => {
    const selectedProductId = e.target.value;
    setInputField(selectedProductId);

    // Find the selected product from useInventory
    const selectedProduct = useInventory.find(
      (product) => product.id === selectedProductId
    );

    // Set the quantity in formData if the product is found
    if (selectedProduct) {
      setFormData((prevData) => ({
        ...prevData,
        product: selectedProductId, // Also update the selected product in formData
        measure_unit: selectedProduct?.product_details?.measure_unit,
        measure_amount: selectedProduct?.product_details?.measure_amount,
        quantity: 1,
      }));
    }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("use_inventory", formData.product);
    formDataToSend.append("total_available_quantity", formData.measure_amount);
    formDataToSend.append("remaining_quantity", formData.measure_amount);
    formDataToSend.append("per_use_consumption", formData.consumption);
    formDataToSend.append("measure_unit", formData.measure_unit);
    formDataToSend.append("quantity", formData.quantity);

    // Add new product to use inventory
    try {
      const endpoint = editProductData
        ? `https://backendapi.trakky.in/spavendor/currentuse/${editProductData.id}/`
        : `https://backendapi.trakky.in/spavendor/currentuse/`;

      const method = editProductData ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      if (response.ok) {
        toast.success(
          editProductData
            ? "product Updated to use inventory successfully"
            : "New product added to use inventory successfully"
        );
        setOpen(false);
        setFormData({
          product: "",
          quantity: "",
          consumption: "",
        });
        UseInventoryData();
      } else {
        toast.error("Error while adding new product to use inventory");
      }
    } catch (error) {
      toast.error("Error while adding new product to use inventory");
    }
  };

  const handleEdit = (Product) => {
    setEditProductData(Product);
    setFormData({
      product: Product?.use_inventory_details?.product_details?.product_name,
      quantity: Product.total_available_quantity,
      consumption: Product.per_use_consumption,
      measure_unit: Product.measure_unit,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/currentuse/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Product deleted successfully");

        // Update the state to remove the deleted item from the list
        setFilterListData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
      } else {
        toast.error("Error while deleting the product");
      }
    } catch (error) {
      toast.error("Error while deleting the product");
    }
  };

  const handleDeleteConfirmation = (id) => {
    confirm({ description: "Are you sure you want to delete this supplier?" })
      .then(() => handleDelete(id))
      .catch(() => console.log("Deletion cancelled."));
  };

  return (
    <>
      <div className=" w-full h-full bg-[#EFECFF]">
        <Toaster />
        <div class="flex items-center justify-between h-14 w-full md:h-16 px-2 md:px-6">
          <div class="h-5 w-5 flex items-center md:hidden">
            <ArrowBackIcon className="w-full" />
          </div>
          <div>
            <h1 class="text-lg font-bold md:text-xl">In Use Product </h1>
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
                Add in use
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

            <div className=" w-full h-full pb-2 px-4  max-w-[100vw] md:max-w-[calc(100vw-288px)] overflow-auto">
              <table className=" border-collapse w-full bg-white rounded-lg text-center min-w-max">
                <tr>
                  <th className=" border border-gray-200 p-2">Product Name</th>
                  <th className=" border border-gray-200 p-2">Product Brand</th>
                  <th className=" border border-gray-200 p-2">
                    Quantity per item
                  </th>
                  <th className=" border border-gray-200 p-2">
                    Remaining Quantity
                  </th>
                  <th className=" border border-gray-200 p-2">
                    Per use Quantity
                  </th>
                  <th className=" border border-gray-200 p-2">Date</th>
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
                ) : filterListData?.length > 0 ? (
                  filterListData?.map((item) => {
                    return (
                      <tr key={item?.id}>
                        <td className=" border border-gray-200 p-2">
                          {
                            item?.use_inventory_details?.product_details
                              ?.product_name
                          }
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {
                            item?.use_inventory_details?.product_details
                              ?.brand_name
                          }
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {item?.total_available_quantity} {item?.measure_unit}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {item.remaining_quantity} {item.measure_unit}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {item.per_use_consumption} {item.measure_unit}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {new Date(item.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short", // You can use "long" for full month name
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          <div className=" flex items-center justify-center h-full gap-2">
                            <button onClick={() => handleEdit(item)}>
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
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <div className="w-full">
            <div className="flex justify-center items-center w-full h-[50vh] p-4 sm:p-8">
              <div className="w-full max-w-[600px] p-8 bg-white shadow-lg rounded-lg">
                <div className="pb-2 flex justify-between items-center">
                  <p className="text-xl font-bold text-center">
                    {editProductData
                      ? "Edit In Use Product"
                      : "Add In Use Product"}
                  </p>
                  <span onClick={handleClose} className="cursor-pointer">
                    <CloseIcon />
                  </span>
                </div>
                <div className="space-y-4 mt-3">
                  <div className="space-y-4">
                    <FormControl fullWidth>
                      <div className="grid grid-cols-2 gap-4">
                        <FormControl
                          variant="outlined"
                          fullWidth
                          margin="normal"
                        >
                          <InputLabel id="input-field-label">
                            Product List
                          </InputLabel>
                          <Select
                            labelId="input-field-label"
                            value={formData.product} // Ensure this matches the selected product ID
                            onChange={handleProductSelect}
                            label="Input Field"
                          >
                            {/* {useInventory?.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product?.product_details.product_name} 
            </MenuItem>
          ))} */}

                            {useInventory?.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item?.product_details.product_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          fullWidth
                          label="Quantity"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          margin="normal"
                        />
                      </div>

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
                          placeholder="Enter Amount"
                          variant="outlined"
                          fullWidth
                          InputProps={{
                            startAdornment:
                              formData.measure_unit === "ml" ? (
                                <InputAdornment position="start">
                                  ml
                                </InputAdornment>
                              ) : formData.measure_unit === "L" ? (
                                <InputAdornment position="start">
                                  L
                                </InputAdornment>
                              ) : formData.measure_unit === "g" ? (
                                <InputAdornment position="start">
                                  g
                                </InputAdornment>
                              ) : formData.measure_unit === "kg" ? (
                                <InputAdornment position="start">
                                  kg
                                </InputAdornment>
                              ) : null,
                          }}
                        />
                      </div>

                      <TextField
                        label={`Per Use Consumption ( ${formData.measure_unit} )`}
                        variant="outlined"
                        fullWidth
                        name="consumption" // Add name attribute for Consumption
                        value={formData.consumption}
                        onChange={handleChange} // The handleChange function will update the consumption field
                        margin="normal"
                      />

                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                          onClick={handleClose}
                          style={{ borderRadius: "6px", minWidth: "100px" }}
                        >
                          Cancel
                        </button>

                        <button
                          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
                          onClick={handleSubmit}
                          style={{ borderRadius: "6px", minWidth: "100px" }}
                        >
                          {editProductData ? "Update" : "Submit"}
                        </button>
                      </div>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InUseProduct;
