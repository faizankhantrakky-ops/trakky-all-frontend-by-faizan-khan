import React, { useState, useEffect, useContext } from "react";
import Divider from "@mui/material/Divider";
import AuthContext from "../../Context/Auth";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Container,
  Box,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const AddProducts = () => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;
  const [suppData, setSuppData] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: "",
    product_brand: "",
    current_stock_quantity: "",
    supplier: "",
    supply_price: "",
    retail_price: "",
    product_category: "",
  });

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salonvendor/supplier/",
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
          setSuppData(data);
        } else {
          toast.error("error while fetching data");
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchSupplierData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/product/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        toast.success("Product added successfully");
        navigate("/sales/Available-products");
        console.log(data);
      } else {
        toast.error("There was some error while adding product");
        console.log("error");
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  return (
    <>
      <div className="pl-[82px] pb-[10px] pt-[80px] pr-[10px] w-full h-[100vh] flex justify-center max-sm:pl-[10px] max-sm:pt-[10px]">
        <div className="w-[600px] flex flex-col items-center bg-white formaddproductsPOS">
          <p className="text-[24px] font-bold">Add Products</p>
          <div className="w-full mt-4 flex flex-col gap-[15px]">
            <div className="w-full font-semibold">Product Info</div>
            <Divider />
            <div className=" w-full flex flex-col gap-[15px]">
              <TextField
                id="outlined-basic"
                label="Product name"
                variant="outlined"
                className="w-full"
                name="product_name"
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                label="Brand name"
                variant="outlined"
                className="w-full"
                name="product_brand"
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                label="Product category"
                variant="outlined"
                className="w-full"
                name="product_category"
                onChange={handleChange}
              />
              <span className="flex gap-[10px]">
                <FormControl className="w-[50%]">
                  <InputLabel id="demo-simple-select-label">
                    Supplier
                  </InputLabel>
                  <Select
                    label="Supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                  >
                    {suppData.map((item) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}

                    {/* <MenuItem value={false}>Temporary</MenuItem> */}
                  </Select>
                </FormControl>
                {/* <TextField id="outlined-basic" label="Distributor" variant="outlined" className='w-[50%]' /> */}
                <TextField
                  id="outlined-basic"
                  label="Current quantity"
                  variant="outlined"
                  className="w-[50%]"
                  name="current_stock_quantity"
                  onChange={handleChange}
                  type="number"
                />
              </span>
              <span className="flex gap-[10px]">
                <TextField
                  name="supply_price"
                  onChange={handleChange}
                  id="outlined-basic"
                  label="Supply price"
                  variant="outlined"
                  className="w-[50%]"
                  type="number"
                />
                <TextField
                  name="retail_price"
                  onChange={handleChange}
                  id="outlined-basic"
                  label="Retail price"
                  variant="outlined"
                  className="w-[50%]"
                  type="number"
                />
              </span>
              <span className="flex justify-center">
                <button
                  className="bg-black text-white px-[10px] py-[10px] rounded-xl"
                  onClick={handleSubmit}
                >
                  Add product
                </button>
              </span>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default AddProducts;
