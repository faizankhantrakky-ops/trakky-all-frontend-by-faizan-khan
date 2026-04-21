import React, { useEffect, useState, useContext } from "react";
import { Search } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AuthContext from "../../Context/Auth";
import DeleteIcon from "@mui/icons-material/Delete";
import toast, { Toaster } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import { Delete, Edit } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import "./Inventory.css"; // Assuming you have the CSS file for styling
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { motion } from "framer-motion";
import AddTaskIcon from "@mui/icons-material/AddTask";

const StockOrder = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [editStockOrderData, setEditStockOrderData] = useState(null);
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const { authTokens } = useContext(AuthContext);
  const [filterData, setFilterData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const token = authTokens.access_token;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [suppData, setSuppData] = useState([]);
  const [productData, setProductData] = useState([]);
  const params = useParams();
  const [formData, setFormData] = useState({
    product: "",
    supply_price: "",
    retail_price: "",
    total_cost: "",
    expected_date: "",
    product_quantity: "",
    for_what: "sell",
    supplier: "",
  });

  const [editStockStatusItem, setEditStockStatusItem] = useState(null);
  const [openStockStatus, setOpenStockStatus] = useState(false);
  const [editStockStatusFormData, setEditStockStatusFormData] = useState({
    status: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOpen = (stockOrderData) => {
    if (stockOrderData) {
      setFormData(stockOrderData);
    } else {
      resetFormData();
    }
    setOpen(true);
    setEditStockOrderData('');
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
  }, [token]);

  const fetchProduct = async () => {
    if (!formData.supplier) {
      return;
    }
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/product/?supplier_id=${formData.supplier}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log("Fetched Product Data:", responseData);
        setProductData(responseData);
      } else {
        console.log("Error while fetching data");
        setProductData([]);
      }
    } catch (error) {
      console.log(error);
      setProductData([]);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [formData.supplier]);

  useEffect(() => {
    const selectedProduct = productData.find(
      (item) => item.id === formData.product
    );
    if (selectedProduct) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        supply_price: selectedProduct.supply_price,
        retail_price: selectedProduct.retail_price,
      }));
    }
  }, [formData.product, productData]);

  const resetFormData = () => {
    setFormData({
      product: "",
      supply_price: "",
      retail_price: "",
      total_cost: "",
      expected_date: "",
      product_quantity: "",
      for_what: "sell",
    });
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      total_cost:
        parseInt(formData.product_quantity) * Number(formData.supply_price),
    }));
  }, [formData.supply_price, formData.product_quantity]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/stockorder/",
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
        setOrders(responseData);
        setFilterData(responseData);
        console.log(responseData);
      } else {
        console.log("Error while fetching data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.product) {
      toast.error("Please select a product");
      return;
    }
    if (!formData.product_quantity || formData.product_quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (!formData.expected_date) {
      toast.error("Please select a date");
      return;
    }

    const data = {
      product: formData.product,
      for_what: formData.for_what,
      expected_date: moment(formData?.expected_date || "").format("YYYY-MM-DD"),
      total_cost: formData.total_cost,
      product_quantity: Number(formData.product_quantity),
      supply_price: formData.supply_price,
      retail_price: formData.retail_price,
    };

    try {
      const response = await fetch(
        editStockOrderData
          ? `https://backendapi.trakky.in/spavendor/stockorder/${editStockOrderData.id}/`
          : "https://backendapi.trakky.in/spavendor/stockorder/",
        {
          method: editStockOrderData ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success(
          editStockOrderData
            ? "Order updated successfully"
            : "Order placed successfully"
        );
        await fetchData();
        resetFormData();
        setOpen(false);
      } else {
        toast.error("Failed to place/update the order");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while placing/updating the order");
    }
  };

  const handleStatusChange = async (orderId) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/stockorder/${orderId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editStockStatusFormData),
        }
      );
      if (response.ok) {
        toast.success("Order status updated successfully");
        await fetchData();
        setOpenStockStatus(false);
        setEditStockOrderData(null);
        setEditStockStatusFormData({ status: "" });
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating order status");
    }
  };


  const handleDelete = async (orderId) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/stockorder/${orderId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setOrders(orders.filter((order) => order.id !== orderId));
        toast.success("Order deleted successfully");
      } else {
        toast.error("Failed to delete order");
        console.log("Error deleting order");
      }
    } catch (error) {
      toast.error("An error occurred while deleting order");
      console.log(error);
    }
  };

  const handleDeleteConfirmation = (orderId) => {
    confirm({ description: "Are you sure you want to delete this order?" })
      .then(() => handleDelete(orderId))
      .catch(() => console.log("Deletion cancelled."));
  };

  const handleEdit = (stockOrderData) => {
    // Set the form data with the product details for editing
    setFormData({
      product: stockOrderData.product,
      supply_price: stockOrderData.supply_price,
      retail_price: stockOrderData.retail_price,
      total_cost: stockOrderData.total_cost,
      expected_date: moment(stockOrderData.expected_date),
      product_quantity: stockOrderData.product_quantity,
      for_what: stockOrderData.for_what,
      supplier: stockOrderData.product_data.supplier,
    });
    setEditStockOrderData(stockOrderData);

    setOpen(true);
  };

  useEffect(() => {
    if (search === "") {
      setFilterData(orders);
    } else {
      setFilterData(
        orders.filter((order) => {
          return order?.product_data?.product_name
            ?.toLowerCase()
            .includes(search.toLowerCase());
        })
      );
    }
  }, [search, orders]);

  const resetSearch = () => {
    setSearch("");
    setFilterData(orders);
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
            <h1 class="text-lg font-bold md:text-xl">Product Order</h1>
          </div>
          {window.innerWidth > 768 ? (
            <div class="flex gap-3 items-center">
              {/* <Link to='Select-Supplier'> */}
              <button
                class="rounded-md bg-black text-white px-4 py-2 text-sm"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleOpen(null);
                }}
              >
                Add order product
              </button>
              {/* </Link> */}
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
                placeholder="Product..."
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
                  <th className=" border border-gray-200 p-2">Order</th>
                  <th className=" border border-gray-200 p-2">Product</th>
                  <th className=" border border-gray-200 p-2">Supplier</th>
                  <th className=" border border-gray-200 p-2">Created</th>
                  <th className=" border border-gray-200 p-2">Expected</th>
                  <th className=" border border-gray-200 p-2">Retail price</th>
                  <th className=" border border-gray-200 p-2">Supply price</th>
                  <th className=" border border-gray-200 p-2">
                    Total Quantity
                  </th>
                  <th className=" border border-gray-200 p-2">Total Cost</th>
                  <th className=" border border-gray-200 p-2">Puspose</th>
                  <th className=" border border-gray-200 p-2">Status</th>
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
                  filterData?.map((order) => {
                    return (
                      <tr key={order?.id}>
                        <td className=" border border-gray-200 p-2">
                          #{order.id}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {order.product_data.product_name}{" "}
                          {order?.productData?.brand_name &&
                            `( ${order?.productData.brand_name} )`}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {order.product_data.supplier_data.name}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {order.created_at.substring(0, 10)}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {order.expected_date.substring(0, 10)}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {order.retail_price}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {order.supply_price}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {order.product_quantity}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {order.total_cost}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {order.for_what}
                        </td>
                        <td className="border border-gray-200 px-2">
                          {order?.status === "on-going" ? (
                            <span className=" text-blue-600 bg-blue-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Pending
                            </span>
                          ) : order?.status === "completed" ? (
                            <span className=" text-emerald-600 bg-emerald-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Approved
                            </span>
                          ) : order?.status === "cancelled" ? (
                            <span className=" text-red-600 bg-red-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Cancelled
                            </span>
                          ) : order?.status === "delayed" ? (
                            <span className=" text-yellow-600 bg-yellow-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Delayed
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          <div className={`flex items-center justify-center h-full gap-2  ${
                           (order.status === "completed" || order.status === "cancelled") ? "cursor-not-allowed" : "cursor-pointer"
                          } `}>
                            <button onClick={() => {

                              if (order.status === "completed" || order.status === "cancelled") {
                                toast.error("You can't edit the order");
                                return;
                              }

                              setEditStockStatusItem(order);
                              setEditStockStatusFormData({ status: order.status });
                              setOpenStockStatus(true);
                            }}
                             className={`${
                              (order.status === "completed" || order.status === "cancelled") ? "cursor-not-allowed" : "cursor-pointer"
                             }`}
                              disabled={order.status === "completed" || order.status === "cancelled"}
                            >
                              <AddTaskIcon
                                sx={{
                                  fontSize: 20,
                                }}
                              />
                            </button>
                            <button onClick={() => handleEdit(order)}
                              className={`${
                                (order.status === "completed" || order.status === "cancelled") ? "cursor-not-allowed" : "cursor-pointer"
                              }`}
                              disabled={order.status === "completed" || order.status === "cancelled"}
                              >
                              <Edit
                                sx={{
                                  fontSize: 20,
                                }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteConfirmation(order.id);
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
        <motion.div
          initial={{ y: -30, opacity: 0 }} // Start position
          animate={{ y: 0, opacity: 1 }} // End position
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <div className="
    
    
    
    ">
            <div className="flex justify-center items-center w-full h-[50vh] p-4 sm:p-8">
              <div className="w-full max-w-[768px] p-8 bg-white shadow-lg rounded-lg">
                <div className="pb-2 flex justify-between items-center">
                  <p className="text-xl font-bold text-center">
                    {editStockOrderData
                      ? "Edit Product Order"
                      : "Add Product Order"}
                  </p>
                  <span onClick={handleClose} className="cursor-pointer">
                    <CloseIcon />
                  </span>
                </div>
                <div className="space-y-4 mt-3">
                  <div className="space-y-4">
                    <div className="flex gap-4">
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

                      <FormControl fullWidth>
                        <InputLabel id="product-label">Product</InputLabel>
                        <Select
                          labelId="product-label"
                          label="Product"
                          name="product"
                          value={formData.product}
                          onChange={handleChange}
                        >
                          {productData.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.product_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    {/* Deliver To Field and Expected Date */}
                    <div className="flex gap-4">
                      <LocalizationProvider
                        dateAdapter={AdapterMoment}
                        style={{ width: "100%" }}
                      >
                        <DatePicker
                          label="Expected Date"
                          inputFormat="YYYY-MM-DD"
                          value={formData.expected_date || null}
                          className="w-full"
                          name="expected_date"
                          onChange={(newDate) => {
                            setFormData((prevData) => ({
                              ...prevData,
                              expected_date: newDate,
                            }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              sx={{ flexGrow: 1, width: "100%" }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                      <FormControl fullWidth>
                        <InputLabel id="for-what-label">For What</InputLabel>
                        <Select
                          labelId="for-what-label"
                          label="For What"
                          name="for_what"
                          value={formData.for_what || ""}
                          onChange={handleChange}
                        >
                          <MenuItem value="sell">Sell</MenuItem>
                          <MenuItem value="use">Use</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    {/* Supply Price and Retail Price Fields */}
                    <div className="flex gap-4">
                      <TextField
                        id="supply-price"
                        label="Supply Price"
                        variant="outlined"
                        fullWidth
                        name="supply_price"
                        value={formData.supply_price || ""}
                        onChange={handleChange}
                        type="number"
                        onWheel={() => document.activeElement.blur()}
                        onKeyDownCapture={(event) => {
                          if (["ArrowUp", "ArrowDown"].includes(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      <TextField
                        id="retail-price"
                        label="Retail Price"
                        variant="outlined"
                        fullWidth
                        name="retail_price"
                        value={formData.retail_price || ""}
                        onChange={handleChange}
                        type="number"
                        onWheel={() => document.activeElement.blur()}
                        onKeyDownCapture={(event) => {
                          if (["ArrowUp", "ArrowDown"].includes(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </div>

                    {/* Total Quantity and Total Cost */}
                    <div className="flex gap-4">
                      <TextField
                        id="total-quantity"
                        label="Total Quantity"
                        variant="outlined"
                        fullWidth
                        value={formData.product_quantity || ""}
                        onChange={(e) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            product_quantity: e.target.value,
                          }));
                        }}
                        type="number"
                        name="total-quantity"
                      />
                      <TextField
                        id="total-cost"
                        label="Total Cost"
                        variant="outlined"
                        name="total_cost"
                        fullWidth
                        value={formData.total_cost || ""}
                        onChange={handleChange}
                        focused
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                        onClick={() => {
                          handleClose();
                          setFormData({});
                        }}
                        s
                        style={{ borderRadius: "6px", minWidth: "100px" }}
                      >
                        Cancel
                      </button>

                      <button
                        className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
                        onClick={handleSubmit}
                        style={{ borderRadius: "6px", minWidth: "100px" }}
                      >
                        {editStockOrderData
                          ? "Update stock order"
                          : "Add stock order"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Toaster />
            </div>
          </div>
        </motion.div>
      </Modal>
      <Modal
        open={openStockStatus}
        onClose={() => setOpenStockStatus(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <motion.div
          initial={{ y: -30, opacity: 0 }} // Start position
          animate={{ y: 0, opacity: 1 }} // End position
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
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
              <div className="w-full max-w-[768px] p-8 bg-white shadow-lg rounded-lg">
                <div className="pb-2 flex justify-between items-center">
                  <p className="text-xl font-bold text-center">
                    Update Order Status
                  </p>
                  <span
                    onClick={() => setOpenStockStatus(false)}
                    className="cursor-pointer"
                  >
                    <CloseIcon />
                  </span>
                </div>
                <div className="space-y-4 mt-3">
                  <div className="space-y-4">
                    <FormControl fullWidth>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        labelId="status-label"
                        label="Status"
                        name="status"
                        value={editStockStatusFormData.status || ""}
                        onChange={(e) => {
                          setEditStockStatusFormData((prevData) => ({
                            ...prevData,
                            status: e.target.value,
                          }));
                        }}
                      >
                        <MenuItem value="on-going">Pending</MenuItem>
                        <MenuItem value="completed">Approved</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                        <MenuItem value="delayed">Delayed</MenuItem>
                      </Select>
                    </FormControl>

                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                        onClick={() => setOpenStockStatus(false)}
                        style={{ borderRadius: "6px", minWidth: "100px" }}
                      >
                        Cancel
                      </button>

                      <button
                        className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
                        onClick={() => handleStatusChange(editStockStatusItem.id)}
                        style={{ borderRadius: "6px", minWidth: "100px" }}
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>  
              </div>
            </div>
          </div>
        </motion.div>          
      </Modal>
    </>
  );
};

export default StockOrder;
