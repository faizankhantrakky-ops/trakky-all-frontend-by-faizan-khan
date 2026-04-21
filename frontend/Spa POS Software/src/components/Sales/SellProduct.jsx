import React, { useContext, useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AuthContext from "../../Context/Auth";
import { useConfirm } from "material-ui-confirm";
import { Toaster } from "react-hot-toast";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ToastContainer, toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import {
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Typography,
  IconButton,
} from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import PersonIcon from "@mui/icons-material/Person";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { BubbleChartTwoTone } from "@mui/icons-material";
import "./SellProduct.css";
import { styled } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// {
//   product_id,
//   qauntity,
//   price_per_unit,
//   discount : RS. ,
//   tax : RS. ,
//   net_sub_total : quantity * price_per_unit + tax - discount,
// }

const SellProduct = () => {
  const { authTokens, vendorData } = useContext(AuthContext);

  console.log(vendorData);
  const navigate = useNavigate();
  const token = authTokens.access_token;

  const [loading, setLoading] = useState(true);
  const [filterData, setFilteredData] = useState([]);
  const [searchProductTerm, setSearchProductTerm] = useState("");
  const [productData, setProductData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchSellHistory, setSearchSellHistory] = useState("");
  const [sellHistory, setSellHistory] = useState([]);
  const [filteredSellHistory, setFilteredSellHistory] = useState([]);

  const [formData, setFormData] = useState({
    // product_name: "",
    // product_brand: "",
    // current_stock_quantity: "",
    // supplier: "",
    // supply_price: "",
    // retail_price: "",
    // product_category: "",

    customerId: "",
    customerName: "",
    customerNumber: "",

    product_list: [],

    net_sub_discount: 0,
    net_sub_price_after_tax: 0,
    final_total: 0,
  });

  const [open, setOpen] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openModelEdit, setOpenModelEdit] = useState(false);

  //
  const [infoProductModal, setInfoProductModal] = useState(false);
  const [infoProductData, setInfoProductData] = useState(null);

  const [editProductData, setEditProductData] = useState({
    product_id: "",
    qauntity: "",
    price_per_unit: "",
    discount_unit: "percentage",
    discount: "",
    tax: "",
    net_sub_total: "",
    product_name: "",
    product_brand: "",
    PIN: "",
  });

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleOpenEdit = () => {
    setOpenModelEdit(true);
  };
  const handleCloseEdit = () => setOpenModelEdit(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleCancel = () => {
    handleCloseEdit(); // Close the modal
  };

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  useEffect(() => {
    if (searchProductTerm === "") {
      setFilteredProducts(productData);
    } else {
      setFilteredProducts(
        productData?.filter((item) =>
          item?.product_details?.product_name
            ?.toLowerCase()
            .includes(searchProductTerm.toLowerCase())
        )
      );
    }
  }, [searchProductTerm, productData]);

  const fetchProductData = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/selling-inventory/",
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
        setProductData(responseData);
        setFilteredData(responseData);
      } else {
        console.log("Error while fetching data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSellHistory = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/sells/",
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
        setSellHistory(responseData);
      } else {
        console.log("Error while fetching data");

        toast.error("Error while fetching data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  // const re-calculate price & discount in the product list
  const reCalculatePrice = () => {
    // Calculate net_sub_total for each product
    const updatedProductList = formData.product_list.map((product) => {
      return {
        ...product,
        net_sub_total:
          product.qauntity * product.price_per_unit +
          product.tax -
          (product.discount_unit == "percentage"
            ? product.qauntity *
              product.price_per_unit *
              (product.discount / 100)
            : product.discount),
      };
    });

    // Calculate net_sub_discount
    const net_sub_discount_t = updatedProductList.reduce(
      (acc, product) => acc + product.discount,
      0
    );

    // Calculate net_sub_price_after_tax
    const net_sub_price_after_tax_t = updatedProductList.reduce(
      (acc, product) => acc + product.tax,
      0
    );

    // Calculate final_total
    const final_total_t = updatedProductList.reduce(
      (acc, product) => acc + product.net_sub_total,
      0
    );

    setFormData((prev) => ({
      ...prev,
      product_list: updatedProductList,
      net_sub_discount: parseFloat(net_sub_discount_t),
      net_sub_price_after_tax: parseFloat(net_sub_price_after_tax_t),
      final_total: parseFloat(final_total_t),
    }));

    return {
      ...formData,
      product_list: updatedProductList,
      net_sub_discount: parseFloat(net_sub_discount_t),
      net_sub_price_after_tax: parseFloat(net_sub_price_after_tax_t),
      final_total: parseFloat(final_total_t),
    };
  };

  useEffect(() => {
    fetchProductData();
    fetchSellHistory();
  }, [token]);

  const defaultImage = "https://via.placeholder.com/96";

  const DrawerList = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        display: "flex",
        padding: "10px",
        flexDirection: { xs: "column", sm: "row" },
      }}
      role="presentation"
    >
      {/* Left Section: Product List */}
      <div className="w-full sm:w-[60%] border-r border-gray-200 flex flex-col gap-6 p-6">
        {/* Search Bar */}
        <div className="flex justify-between">
          <h1 className="text-[22px] font-semibold">Sell Product</h1>
          <button onClick={toggleDrawer(false)} className="sm:hidden block">
            <CloseIcon />
          </button>
        </div>

        <div className="flex items-center">
          <TextField
            variant="outlined"
            fullWidth
            value={searchProductTerm}
            onChange={(e) => setSearchProductTerm(e.target.value)}
            placeholder="Search products"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ borderRadius: 1, borderColor: "gray.300" }}
          />
        </div>

        <h2 className="text-[20px] font-semibold">Product</h2>
        {/* Product List */}
        <div
          className={`max-h-[400px] no-scrollbar overflow-y-auto ${
            filteredProducts.length === 0
              ? "overflow-hidden h-screen max-h-[400px]"
              : "grid grid-cols-1 sm:grid-cols-2 gap-4"
          }`}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <div
                key={index}
                className={`flex bg-white border border-gray-300 rounded-lg cursor-pointer transition-transform transform hover:bg-gray-100 ${
                  formData.product_list.filter(
                    (product) => product.product_id == item.product
                  ).length > 0
                    ? `!bg-gray-200`
                    : ""
                }`}
                onClick={() => {
                  // check if product is already in the list
                  const isProductInList = formData.product_list.find(
                    (product) => product.product_id == item.product
                  );

                  if (isProductInList) {
                    return;
                  }

                  // Add product to the list

                  setFormData({
                    ...formData,
                    product_list: [
                      ...formData.product_list,
                      {
                        product_id: item.product,
                        product_name: item.product_details?.product_name,
                        product_brand: item.product_details?.brand_name,
                        PIN: item.product_details
                          ?.product_indentification_number,
                        qauntity: 1,
                        price_per_unit: item.retail_price_per_unit,
                        discount: 0,
                        discount_unit: "percentage",
                        tax: 0,
                        net_sub_total: item.retail_price_per_unit,
                      },
                    ],
                  });

                  // re-calculate price & discount in the product list
                }}
              >
                <div className="flex justify-center items-center p-4">
                  <img
                    src={item?.image_url || defaultImage}
                    alt={item?.product_details?.product_name}
                    className="object-cover"
                    style={{ width: "48px", height: "48px" }}
                  />
                </div>
                <div className="w-[0.1px] bg-gray-300"></div>
                <div className="flex-1 p-4">
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="text-lg font-semibold">
                        {item?.product_details?.product_name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-gray-500">
                        ₹{item.retail_price_per_unit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-[300px] w-full">
              <div className="bg-white p-6 rounded-lg w-full text-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">
                  No Products Found
                </h2>
                <p className="text-gray-500 mb-6">
                  It seems like there are no products available right now.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Client Info and Checkout */}
      <div className="w-full sm:w-[40%] flex flex-col gap-6 p-6">
        <div
          className="rounded-lg border border-gray-300 overflow-hidden cursor-pointer transition-transform transform hover:bg-gray-100 h-[130px]"
          onClick={handleOpen}
        >
          <div className="p-5 flex justify-between items-center">
            <div className="flex flex-col">
              <h4 className="font-semibold text-gray-800 ">
                {formData.customerName && formData.customerName ? (
                  <div className=" flex flex-col gap-2">
                    <div className="">{formData.customerName}</div>
                    <div className="text-gray-500 text-sm">
                      {formData.customerNumber}
                    </div>
                  </div>
                ) : formData.customerNumber ? (
                  <div className="">{formData.customerNumber}</div>
                ) : formData.customerName ? (
                  <div className="">{formData.customerName}</div>
                ) : (
                  "Add Customer"
                )}
              </h4>
            </div>
            <div>
              <div className="flex justify-center items-center bg-purple-100 p-4 rounded-full">
                <PersonIcon className="text-purple-600 text-8xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Items and Checkout */}

        {/* due to *:scrollbar none it no where show scrollbar ? i want specefic place even custom class with !important not work whai i can do? */}

        <div className="flex flex-col justify-between h-full">
          {/* Product Items List */}
          <div
            className="flex flex-col gap-4 pr-3 h-[200px] overflow-y-auto custom-scrollbar"
            style={{
              "&::-webkit-scrollbar": {
                width: "5px",
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#512DC8",
                borderRadius: "24px",
              },
            }}
          >
            {formData?.product_list.map((item, index) => (
              <div
                key={index}
                className="relative flex justify-between items-center p-2 bg-white rounded-lg group hover:bg-gray-100 transition-all duration-300 "
                onClick={() => {
                  setEditProductData({
                    product_id: item.product_id,
                    qauntity: item.qauntity,
                    price_per_unit: item.price_per_unit,
                    discount: item.discount,
                    discount_unit: "percentage",
                    tax: item.tax,
                    net_sub_total: item.net_sub_total,
                    product_name: item.product_name,
                    product_brand: item.product_brand,
                    PIN: item.PIN,
                  });

                  handleOpenEdit();
                }}
              >
                {/* Content */}
                <div className="flex gap-2 items-center justify-center">
                  <div className="w-[5px] h-[64px] bg-slate-300 rounded-lg transition-all ease-in-out duration-300 group-hover:w-[8px]"></div>
                  <div className="flex flex-col">
                    <p className="font-semibold ">
                      {item.product_name || "Product Name"}
                    </p>
                    <p className="text-sm text-gray-500">{item.PIN || "-"}</p>
                  </div>
                </div>

                {/* Price and Icons */}
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm group-hover:hidden font-semibold">{`₹${
                    item?.net_sub_total?.toFixed(2) || 0
                  }`}</p>
                  <div className="hidden group-hover:flex gap-2">
                    <div className="p-1 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer group">
                      <BootstrapTooltip title="Edit" placement="top">
                        <button onClick={handleOpenEdit}>
                          <ModeEditOutlineOutlinedIcon />
                        </button>
                      </BootstrapTooltip>
                    </div>
                    <div className="p-1 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer group">
                      <BootstrapTooltip title="Delete" placement="top">
                        <button
                          onClick={() => {
                            const updatedProductList =
                              formData.product_list.filter(
                                (product) =>
                                  product.product_id != item.product_id
                              );

                            console.log(updatedProductList);

                            setFormData((prev) => ({
                              ...prev,
                              product_list: updatedProductList,
                            }));

                            // re-calculate price & discount in the product list
                          }}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </button>
                      </BootstrapTooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">total amount</p>
                <p className="text-gray-500">
                  ₹{" "}
                  {formData.product_list
                    .reduce(
                      (acc, item) => acc + item.qauntity * item.price_per_unit,
                      0
                    )
                    ?.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">Discount</p>
                <p className="text-gray-500">
                  ₹
                  {formData.product_list
                    .reduce((acc, item) => {
                      return (
                        acc +
                        (item.discount_unit === "percentage"
                          ? parseInt(item.qauntity * item.price_per_unit) *
                            parseFloat(item.discount / 100)
                          : parseFloat(item.discount))
                      );
                    }, 0)
                    ?.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">Tax</p>
                <p className="text-gray-500">
                  ₹
                  {formData.product_list.reduce(
                    (acc, item) => acc + item.tax,
                    0
                  )}
                </p>
              </div>
              <div className="flex justify-between font-bold text-lg mb-2">
                <p>Total</p>
                <p>₹{formData?.final_total?.toFixed(2) || 0}</p>
              </div>
            </div>

            <Divider sx={{ borderColor: "#e0e0e0", width: "100%" }} />
            <div className="flex items-center justify-between mt-4">
              {/* <button className="text-black bg-gray-200 p-2 rounded-full cursor-default">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button> */}
              <button
                className="bg-black text-white py-2 px-4 rounded-lg text-[18px] w-full"
                onClick={() => {
                  handleSellProduct();
                }}
              >
                Sell products
              </button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );


  useEffect(() => {
    if (searchSellHistory === "") {
      setFilteredSellHistory(sellHistory);
    } else {
      // search in customer name and customer phone
      setFilteredSellHistory(
        sellHistory.filter(
          (item) =>
            item?.client_details?.customer_name
              ?.toLowerCase()
              .includes(searchSellHistory.toLowerCase()) ||
            item?.client_details?.customer_phone
              ?.toLowerCase()
              .includes(searchSellHistory.toLowerCase())
        )
      );
    }
  }, [searchSellHistory, sellHistory]);

  const getCustomerByNumber = async (number) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/customer-table/?customer_phone=${number}`,
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

        console.log(responseData);
        if (responseData.length > 0) {
          const customer = responseData[0];
          // setFormData({
          //   ...formData,
          //   customerId: customer.id,
          //   customerName: customer.customer_name,
          //   // customerGender: customer.customer_gender
          // });
          return customer;
        }
      } else {
        console.log("Error while fetching data");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    if (formData.customerNumber.length === 10) {
      getCustomerByNumber(formData.customerNumber).then((data) => {
        if (data) {
          setFormData({
            ...formData,
            customerId: data.id,
            customerName: data.customer_name,
          });
        }
      });
    }
  }, [formData.customerNumber]);

  const handleSellProduct = async () => {
    // payload
    //   {
    //     "customer_phone": "1234567892",
    //     "customer_name": "John Doe",  // This will be used only if creating a new customer
    //     "customer_gender": "Male",      // This will be used only if creating a new customer
    //     "customer_email": "johndoe@example.com", // This will be used only if creating a new customer
    //     "product_list": [
    //         {
    //             "product_id": 2,
    //             "quantity": 1
    //         }
    //     ],
    //     "net_sub_discount": 5.0,
    //     "net_sub_price_after_tax": 95.0,
    //     "final_total": 100.0
    // }

    let tempFormData = await reCalculatePrice();

    let url = `https://backendapi.trakky.in/spavendor/sells/`;

    let payload = {
      customer_phone: formData.customerNumber,
      customer_name: formData.customerName,
      product_list: tempFormData.product_list,
      net_sub_discount: tempFormData.net_sub_discount,
      net_sub_price_after_tax: tempFormData.net_sub_price_after_tax,
      final_total: tempFormData.final_total,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        toast.success("Product sold successfully");
        toggleDrawer(false)();
        fetchSellHistory();
      } else {
        console.log("Error while fetching data");
        toast.error("Error while fetching data");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching data");
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
          <h1 class="text-lg font-bold md:text-xl">Sell Products</h1>
        </div>
        {window.innerWidth > 768 ? (
          <div class="flex gap-3 items-center">
            {/* <button
              class="rounded-md bg-black text-white px-4 py-2 text-sm"
              style={{ cursor: "pointer" }}
              onClick={() => {
                // handleOpenbutton(null);
                navigate("/sales/Available-products");
              }}
            >
              Add
            </button> */}
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <button className="rounded-md border border-gray-300 p-1 ">
              <MoreVertIcon className="h-5 w-5" />
            </button>
            <button
              className="rounded-md border border-gray-300 p-1"
              onClick={() => {
                // handleOpenbutton(null);
                navigate("/sales/Available-products");
              }}
            >
              <AddIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className=" w-full  h-[calc(100%-60px)] md:h-[calc(100%-68px)]  mt-1 ">
        <div className=" w-full h-full flex flex-col gap-2">
          <div className=" w-full h-14 px-3 flex justify-between py-2 gap-2 shrink-0">
            <div className="flex gap-2 w-full max-w-fit">
              <input
                type="text"
                name="search"
                id="search"
                value={searchSellHistory}
                onChange={(e) => setSearchSellHistory(e.target.value)}
                className=" shrink grow h-full w-full max-w-[min(100%,400px)] rounded-xl outline-none active:outline-none focus:outline-none px-4"
                placeholder="Search customer name..."
              />
              <button
                onClick={() => {
                  setSearchSellHistory("");
                }}
                className=" bg-[#512DC8] h-full w-20 flex items-center justify-center text-center text-sm text-white rounded-xl border-2 border-[#EFECFF]"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center justify-end h-full gap-2">
              <button
                className=" bg-[#512DC8] h-full w-full flex items-center justify-center text-center text-sm text-white rounded-xl border-2 border-[#EFECFF] p-3"
                onClick={toggleDrawer(true)}
              >
                Sell products
              </button>
            </div>
          </div>

          <div className="  w-full h-full pb-2 px-4  max-w-[100vw] md:max-w-[calc(100vw-288px)] overflow-auto">
            <table className=" border-collapse w-full bg-white rounded-lg text-center min-w-max">
              <tr>
                <th className=" border border-gray-200 p-2">Customer name</th>
                <th className=" border border-gray-200 p-2">Customer number</th>
                <th className=" border border-gray-200 p-2">Product details</th>
                <th className=" border border-gray-200 p-2">Total Discount</th>
                <th className=" border border-gray-200 p-2">Total Tax</th>
                <th className=" border border-gray-200 p-2">Final Price</th>
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
              ) : filteredSellHistory?.length > 0 ? (
                filteredSellHistory?.map((item) => {
                  return (
                    <tr key={item?.id}>
                      <td className=" border border-gray-200 p-2">
                        {item?.client_details?.customer_name || "-"}
                      </td>
                      <td className=" border border-gray-200 p-2">
                        {item?.client_details?.customer_phone || "-"}
                      </td>
                      <td className=" border border-gray-200 p-2">
                        <InfoOutlinedIcon
                          className="text-gray-500 mx-auto cursor-pointer"
                          onClick={() => {
                            setInfoProductData(item);
                            setInfoProductModal(true);
                          }}
                        />
                      </td>
                      <td className=" border border-gray-200 p-2">
                        ₹{item.net_sub_discount || 0}
                      </td>
                      <td className=" border border-gray-200 p-2">
                        ₹{item.net_sub_price_after_tax || 0}
                      </td>
                      <td className=" border border-gray-200 p-2">
                        ₹{item.final_total || 0}
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

      <div className="flex">
        {/* Close Icon positioned outside of the Drawer */}
        {open && (
          <button
            onClick={toggleDrawer(false)}
            style={{
              position: "fixed",
              zIndex: 10000,
              backgroundColor: "#fff",
              borderRadius: "50%",
              padding: "8px",
              transition: "left 0.4s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
            className="hidden sm:block top-[1.5rem] sm:top-4 left-4"
          >
            <CloseIcon />
          </button>
        )}

        {/* Notification Drawer */}
        <Drawer
          anchor="right"
          open={open}
          onClose={toggleDrawer(false)}
          sx={{
            width: "100%",
            maxWidth: "100vw",
            "& .MuiDrawer-paper": {
              width: "95%",
              maxWidth: "100%",
            },
            "@media (max-width: 640px)": {
              "& .MuiDrawer-paper": {
                width: "100%",
              },
            },
          }}
        >
          {DrawerList}
        </Drawer>
      </div>

      {/* Model For Add Clinet Deatil    */}
      <Modal open={openModal} onClose={handleClose} sx={{ zIndex: "1000000" }}>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0, 0, 0, 0.5)", // Adds background overlay
          }}
        >
          <div className="bg-white flex flex-col gap-6 justify-center items-center p-8 w-[380px] rounded-lg shadow-2xl relative">
            {/* Close Icon */}
            <span
              className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-700 transition-colors"
              onClick={() => setOpenModal(false)}
            >
              <CloseIcon />
            </span>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-700">
              Add Client Details
            </h2>

            {/* Input Fields */}
            <TextField
              fullWidth
              id="outlined-basic"
              label="Customer Number"
              variant="outlined"
              type="number"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              value={formData.customerNumber}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  customerNumber: e.target.value,
                });
              }}
            />

            <TextField
              fullWidth
              id="outlined-basic"
              label="Customer Name"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              value={formData.customerName}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  customerName: e.target.value,
                });
              }}
            />

            {/* Save Button */}
            <button
              className="bg-purple-700 hover:bg-purple-800 transition-colors text-white px-8 py-2 rounded-lg font-semibold shadow-md"
              // onClick={handleaddClientbtn}
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Save
            </button>
          </div>
        </Box>
      </Modal>

      <Modal
        sx={{ zIndex: "10000000" }}
        onClose={handleCloseEdit}
        open={openModelEdit}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0, 0, 0, 0.5)", // Adds background overlay
          }}
        >
          <div className="bg-white rounded-lg p-6 mx-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Edit product
              </h2>
              <IconButton onClick={handleCloseEdit}>
                <CloseIcon />
              </IconButton>
            </div>

            {/* Product Info */}
            <div className="flex flex-row sm:flex-row gap-4 items-start mt-4">
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div className="flex flex-col">
                <p className="text-lg font-semibold">
                  {editProductData.product_name}
                </p>
                <p className="text-gray-500">
                  {editProductData.product_brand} • {editProductData.PIN}
                </p>
              </div>
              <p className="text-xl font-semibold mt-4 sm:mt-0 sm:ml-auto">
                ₹{editProductData.price_per_unit * editProductData.qauntity}
              </p>
            </div>

            {/* Price and Quantity */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                value={editProductData.price_per_unit}
                onChange={(e) => {
                  setEditProductData({
                    ...editProductData,
                    price_per_unit: e.target.value,
                  });
                }}
              />
              <TextField
                label="Quantity"
                variant="outlined"
                fullWidth
                value={editProductData.qauntity}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <div className="flex items-center">
                      <button
                        className="px-3 py-2 text-gray-700"
                        onClick={() => {
                          if (editProductData.qauntity > 1) {
                            setEditProductData({
                              ...editProductData,
                              qauntity: editProductData.qauntity - 1,
                            });
                          }
                        }}
                      >
                        -
                      </button>
                    </div>
                  ),
                  endAdornment: (
                    <div
                      className="flex items-center"
                      onClick={() => {
                        setEditProductData({
                          ...editProductData,
                          qauntity: editProductData.qauntity + 1,
                        });
                      }}
                    >
                      <button className="px-3 py-2 text-gray-700">+</button>
                    </div>
                  ),
                }}
              />
            </div>

            {/* Discount */}
            <div className="mt-4">
              <TextField
                label="Discount"
                variant="outlined"
                fullWidth
                helperText={`Discounted amount : ₹ ${
                  editProductData.discount_unit == "percentage"
                    ? editProductData.price_per_unit *
                      editProductData.qauntity *
                      (editProductData.discount / 100)
                    : editProductData.discount
                }       
                  `}
                InputProps={{
                  startAdornment: (
                    <select
                      value={editProductData.discount_unit}
                      className="px-2 py-1 border-none outline-none bg-transparent mr-3"
                      onChange={(e) => {
                        setEditProductData({
                          ...editProductData,
                          discount_unit: e.target.value,
                        });
                      }}
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">₹</option>
                    </select>
                  ),
                }}
                value={editProductData.discount}
                onChange={(e) => {
                  if (
                    editProductData.discount_unit == "percentage" &&
                    e.target.value > 100
                  ) {
                    return;
                  }

                  if (
                    editProductData.discount_unit == "fixed" &&
                    e.target.value >
                      editProductData.price_per_unit * editProductData.qauntity
                  ) {
                    return;
                  }

                  setEditProductData({
                    ...editProductData,
                    discount: e.target.value,
                  });
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-row sm:flex-row justify-between items-center mt-6">
              <BootstrapTooltip title="Delete" placement="top">
                <IconButton
                  onClick={() => {
                    const updatedProductList = formData.product_list.filter(
                      (product) =>
                        product.product_id != editProductData.product_id
                    );

                    console.log(updatedProductList);

                    setFormData((prev) => ({
                      ...prev,
                      product_list: updatedProductList,
                    }));

                    handleCloseEdit();

                    // re-calculate price & discount in the product list
                  }}
                  color="default"
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </BootstrapTooltip>
              <div className="flex flex-row sm:flex-row gap-4 mt-4 sm:mt-0">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
                  onClick={() => {
                    const updatedProductList = formData.product_list.map(
                      (product) =>
                        product.product_id == editProductData.product_id
                          ? {
                              ...product,
                              qauntity: editProductData.qauntity,
                              price_per_unit: editProductData.price_per_unit,
                              discount: editProductData.discount,
                              discount_unit: editProductData.discount_unit,
                              net_sub_total:
                                editProductData.qauntity *
                                  editProductData.price_per_unit -
                                (editProductData.discount_unit == "percentage"
                                  ? editProductData.qauntity *
                                    editProductData.price_per_unit *
                                    (editProductData.discount / 100)
                                  : editProductData.discount),
                            }
                          : product
                    );

                    setFormData((prev) => ({
                      ...prev,
                      product_list: updatedProductList,
                    }));

                    handleCloseEdit();

                    // re-calculate price & discount in the product list
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal
        sx={{
          zIndex: "1000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderStyle: "none",
          ":focus": {
            outline: "none",
          },
          outline: "none",
        }}
        onClose={() => {
          setInfoProductModal(false);
        }}
        open={infoProductModal}
      >
        <div className="bg-white rounded-lg p-6 mx-4 w-fit ">
          <table className="w-full border-collapse">
            <thead className=" border-collapse">
              <tr className=" bg-gray-100">
                <th className=" border border-solid py-2 px-3 min-w-max">
                  <span className=" block min-w-max">Product Name</span>
                </th>
                <th className=" border border-solid py-2 px-3 min-w-max">
                  <span className=" block min-w-max">Product Brand</span>
                </th>
                <th className=" border border-solid py-2 px-3 min-w-max">
                  <span className="block min-w-max">Price</span>
                </th>
                <th className=" border border-solid py-2 px-3 min-w-max">
                  <span className=" block min-w-max">Quantity</span>
                </th>
                <th className=" border border-solid py-2 px-3 min-w-max">
                  <span className=" block min-w-max">Discount</span>
                </th>
                <th className=" border border-solid py-2 px-3 min-w-max">
                  <span className=" block min-w-max">Tax</span>
                </th>
                <th className=" border border-solid py-2 px-3 min-w-max">
                  <span className=" block min-w-max">Net Sub Total</span>
                </th>
              </tr>
            </thead>
            <tbody className=" border-collapse">
              {infoProductData?.product_list?.map((item, index) => {
                return (
                  <tr key={index} className=" border-collapse text-center">
                    <td className="border border-solid py-2 px-3 min-w-max">
                      {item?.product_name || "-"}
                    </td>
                    <td className="border border-solid py-2 px-3 min-w-max">
                      {item?.product_brand || "-"}
                    </td>
                    <td className="border border-solid py-2 px-3 min-w-max">
                      {item?.price_per_unit || "-"}
                    </td>
                    <td className="border border-solid py-2 px-3 min-w-max">
                      {item?.qauntity || "-"}
                    </td>
                    <td className="border border-solid py-2 px-3 min-w-max">
                      {item?.discount_unit
                        ? item.discount_unit == "percentage"
                          ? parseInt(item.qauntity) *
                            parseFloat(item.price_per_unit) *
                            (parseFloat(item.discount) / 100)
                          : parseFloat(item.discount)
                        : 0}
                    </td>
                    <td className="border border-solid py-2 px-3 min-w-max">
                      {item?.tax || "-"}
                    </td>
                    <td className="border border-solid py-2 px-3 min-w-max">
                      {item?.net_sub_total || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default SellProduct;
