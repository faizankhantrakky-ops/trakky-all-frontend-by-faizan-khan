import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/Auth";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import moment from "moment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import toast, { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
export default function SelectProducts() {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;
  const [product, setProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [productData, setProductData] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [deliverTo, setDeliverTo] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salonvendor/product/",
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
          setProductData(responseData);
        } else {
          console.log("Error while fetching data");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (event) => {
    setProduct(event.target.value);
  };

  useEffect(() => {
    const selected = productData.filter((item) => item.id === product);
    setSelectedProduct(selected);
  }, [product, productData]);

  useEffect(() => {
    if (selectedDate) {
      const momentDate = moment(selectedDate);
      console.log(momentDate.format("YYYY-MM-DD"));
    }
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!product) {
      toast.error("Please select a product");
      return;
    }
    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (!deliverTo) {
      toast.error("Please enter a delivery address");
      return;
    }

    const data = {
      product,
      deliver_to: deliverTo,
      expected_date: selectedDate
        ? moment(selectedDate).format("YYYY-MM-DD")
        : null,
      total_quantity: quantity,
      total_cost: product
        ? quantity
          ? quantity * selectedProduct[0]?.supply_price
          : null
        : null,
    };

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/stockorder/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success("Order placed successfully");
        navigate("/sales/stock-order");
        // Reset form or handle success
      } else {
        toast.error("Failed to place the order");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while placing the order");
    }
  };

  return (
    <div className="mainSelectProductStockOrder pl-[82px] py-[10px] pr-[10px] max-sm:pl-[10px] flex justify-center items-center">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="w-[450px] bg-white p-[25px] flex flex-col justify-center items-center gap-[25px]"
      >
        <TextField
          id="outlined-basic"
          label="Supplier Name"
          variant="outlined"
          value={params.supplier}
          focused={true}
          className="w-full"
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Product</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={product}
            label="Product"
            onChange={handleChange}
          >
            {productData
              .filter((item) => item.supplier_data.name === params.supplier)
              .map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.product_name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          id="outlined-basic"
          label="Product Category"
          variant="outlined"
          value={selectedProduct[0]?.product_category || "Select a product"}
          focused={true}
          className="w-full"
        />

        <TextField
          id="outlined-basic"
          label="Deliver To"
          variant="outlined"
          className="w-full"
          value={deliverTo}
          onChange={(e) => setDeliverTo(e.target.value)}
        />
        <span className="w-full">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Expected date"
                className="w-full"
                inputFormat="YYYY-MM-DD"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </DemoContainer>
          </LocalizationProvider>
        </span>
        <span className="w-full flex gap-[15px]">
          <TextField
            id="outlined-basic"
            label="Supply price"
            variant="outlined"
            value={selectedProduct[0]?.supply_price || "Select a product"}
            focused={true}
            className="w-[50%]"
          />
          <TextField
            id="outlined-basic"
            label="Retail price"
            variant="outlined"
            value={selectedProduct[0]?.retail_price || "Select a product"}
            focused={true}
            className="w-[50%]"
          />
        </span>
        <span className="w-full flex gap-[15px]">
          <TextField
            id="outlined-basic"
            type="number"
            inputProps={{ min: 0 }}
            label="Total quantity"
            variant="outlined"
            value={quantity}
            focused={true}
            className="w-[50%]"
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Total cost"
            variant="outlined"
            value={
              product
                ? quantity
                  ? quantity * selectedProduct[0]?.supply_price
                  : "Enter quantity"
                : "Select product"
            }
            focused={true}
            className="w-[50%]"
          />
        </span>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
