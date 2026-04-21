import React, { useEffect, useState , useContext} from "react";
import Divider from "@mui/material/Divider";
import SupplierList from "./SupplierList";
import AddSupplier from "./AddSupplier";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from '../../Context/Auth';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { Delete, Edit } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { useConfirm } from 'material-ui-confirm';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import { motion } from 'framer-motion'; 
import './Distruter.css'

const Supplier = () => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;

  const [active, setactive] = useState("Supplier");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [open, setOpen] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [SuppData, setSuppData] = useState([]);
  const [search, setSearch] = useState("");
  const [editDistribution , setEditDistribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();

  const steps = editDistribution
  ? ['Edit Distributor Details', 'Edit Physical Address', 'Edit Contact Information']
  : ['Distributor Details', 'Physical Address', 'Contact Information'];
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    supplier_description: '',
    address: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    first_name: '',
    last_name: '',
    mobile_no: '',
    telephone: '',
    email: '',
    website: '',
  });

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const handleOpen = () => {
    setOpen(true);
    resetForm();
    setActiveStep(0);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchData();
  },[]); 
  
  const resetForm = () => {
    setFormData({
      name: '',
      supplier_description: '',
      address: '',
      state: '',
      city: '',
      country: '',
      pincode: '',
      first_name: '',
      last_name: '',
      mobile_no: '',
      telephone: '',
      email: '',
      website: '',
    });
    setActiveStep(0);  // Optionally reset the stepper
    setEditDistribution(false);  // Reset the edit mode
  };

  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backendapi.trakky.in/spavendor/supplier/', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSuppData(data);
        setFilterData(data);
      } else {
        toast.error('Error while fetching data');
      }
    } catch (error) {
      toast.error('An error occurred while fetching data');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://backendapi.trakky.in/spavendor/supplier/${id}/`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuppData(SuppData.filter(supplier => supplier.id !== id));
        toast.success('Supplier deleted successfully');
      } else {
        toast.error('Error deleting supplier');
      }
    } catch (error) {
      toast.error('An error occurred while deleting supplier');
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name || '',
      supplier_description: supplier.supplier_description || '',
      address: supplier.address || '',
      state: supplier.state || '',
      city: supplier.city || '',
      country: supplier.country || '',
      pincode: supplier.pincode || '',
      first_name: supplier.first_name || '',
      last_name: supplier.last_name || '',
      mobile_no: supplier.mobile_no || '',
      telephone: supplier.telephone || '',
      email: supplier.email || '',
      website: supplier.website || '',
    });
    setActiveStep(0);
    setEditDistribution(supplier);  // Save the entire supplier object, including the id
    setOpen(true);
  };
  
    

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      supplier_description: formData.supplier_description,
      address: formData.address,
      state: formData.state,
      city: formData.city,
      country: formData.country,
      pincode: formData.pincode,
      first_name: formData.first_name,
      last_name: formData.last_name,
      mobile_no: formData.mobile_no,
      telephone: formData.telephone,
      email: formData.email,
      website: formData.website,
    }
    try {
      const response = await fetch(editDistribution?.id ? `https://backendapi.trakky.in/spavendor/supplier/${editDistribution.id}/` 
        : 'https://backendapi.trakky.in/spavendor/supplier/',
        {
          method: editDistribution?.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
    if(response.ok)
    {
      toast.success(editDistribution? "Supplier updated successfully" : "Supplier added successfully");
      handleClose();
      resetForm();
      fetchData();
      setOpen(false);
    }
    else
    {
      toast.error('Error saving supplier');
    }
    }
    catch (error) {
      console.error("Error saving supplier:", error);
      toast.error("Failed to save supplier.");
    }
  };

  const handleDeleteConfirmation = (id) => {
    confirm({ description: "Are you sure you want to delete this supplier?" })
      .then(() => handleDelete(id))
      .catch(() => console.log("Deletion cancelled."));
  };

  useEffect(() => {
    if (search === "") {
      setFilterData(SuppData);
    }
    else {
      setFilterData(SuppData.filter((item) =>
        item?.name.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, SuppData])

  const resetSearch = () => {
    setSearch("");
    setFilterData(SuppData);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="w-full max-w-[768px] space-y-6 px-5 py-5 rounded-lg">
            <div className="space-y-4 bg-white p-5 rounded-lg">
              <div className="flex flex-col gap-3">
                <span className="flex flex-col">
                  <TextField
                    name="name"
                    value={formData.name}
                    label="Distributor Name"
                    onChange={handleChange}
                    placeholder="Enter Distributor Name"
                    variant="outlined"
                    className="w-full"
                  />
                </span>
                <span className="flex flex-col">
                  <TextField
                    name="supplier_description"
                    value={formData.supplier_description}
                    onChange={handleChange}
                    label="Distributor Description"
                    placeholder="Enter Distributor Description"
                    variant="outlined"
                    className="w-full"
                  />
                </span>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="w-full max-w-[786px] space-y-6 px-5 py-5 rounded-lg">
            <div className="space-y-4 p-5 rounded-lg">
              <div className="flex flex-col gap-3">
                <span className="flex flex-col">
                  <TextField
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    label="Address"
                    placeholder="Full address"
                    multiline
                    rows={2}
                    variant="outlined"
                    className="w-full"
                  />
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <span className="flex flex-col">
                    <TextField
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      label="State"
                      placeholder="Enter State"
                      variant="outlined"
                      className="w-full"
                    />
                  </span>
                  <span className="flex flex-col">
              
                    <TextField
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      label="City"
                      placeholder="Enter City"
                      variant="outlined"
                      className="w-full"
                    />
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="flex flex-col">
                    
                    <TextField
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      label="Country"
                      placeholder="Enter Country"
                      variant="outlined"
                      className="w-full"
                    />
                  </span>
                  <span className="flex flex-col">
                    
                    <TextField
                      name="pincode"
                      label="Pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter Pincode"
                      variant="outlined"
                      className="w-full"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
        case 2:
          return (
            <div className="w-full max-w-[786px] space-y-6 mt-1 px-5 py-5 rounded-lg">
              <div className="space-y-4 p-5 rounded-lg">
                <div className="grid grid-cols-2 gap-x-4">
                  {/* First Name */}
                  <span className="flex flex-col">
                  
                    <TextField
                      name="first_name"
                      label="First Name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Enter First Name"
                      variant="outlined"
                      className="w-full"
                    />
                  </span>
        
                  {/* Last Name */}
                  <span className="flex flex-col">
                    
                    <TextField
                      name="last_name"
                      label="Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Enter Last Name"
                      variant="outlined"
                      className="w-full"
                    />
                  </span>
                </div>
        
                <div className="grid grid-cols-2 gap-x-4">
                  {/* Mobile Number */}
                  <span className="flex flex-col">
             
                    <TextField
                      name="mobile_no"
                      value={formData.mobile_no}
                      onChange={(e) => {
                        const value = e.target.value;
                        
                        // Allow only numeric input and limit to 10 digits
                        if (/^\d{0,10}$/.test(value)) {
                          handleChange(e);  // Call handleChange only if input is valid
                        }
                      }}
                      label="Mobile Number"
                      type="number"
                      placeholder="Enter Number"
                      variant="outlined"
                      className="w-full"
                      inputProps={{ maxLength: 10, inputMode: 'numeric', }} 
                    />
                  </span>
        
                  {/* Alternate Mobile Number */}
                  <span className="flex flex-col">
                    
                    <TextField
                      name="telephone"
                      label="Alternate Mobile Number"
                      value={formData.telephone}
                      onChange={handleChange}
                      type="number"
                      placeholder="Enter Alternate Number"
                      variant="outlined"
                      className="w-full"
                    />
                  </span>
                </div>
        
                <div className="grid grid-cols-2 gap-x-4">
                  {/* E-mail */}
                  <span className="flex flex-col">
                    <TextField
                      name="email"
                      label="E-mail"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="Enter Email"
                      variant="outlined"
                      className="w-full"
                    />
                  </span>
        
                  {/* Website */}
                  <span className="flex flex-col">
                    <TextField
                      name="website"
                      label="Website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="Enter Website URL"
                      variant="outlined"
                      className="w-full"
                    />
                  </span>
                </div>
              </div>
            </div>
          );
          default:
        
        return 'Unknown step';
    }
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
            <h1 class="text-lg font-bold md:text-xl">Distributor</h1>
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
                Add distributor
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
                placeholder="Distributor name..."
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
            <th className=" border border-gray-200 p-2">Name</th>
            <th className=" border border-gray-200 p-2">Supplier Description</th>
            <th className=" border border-gray-200 p-2">
              First Name
            </th>
            <th className=" border border-gray-200 p-2">Last Name</th>
            <th className=" border border-gray-200 p-2">
              Mobile No
            </th>
            <th className=" border border-gray-200 p-2">Telephone</th>
            <th className=" border border-gray-200 p-2">Email</th>
            <th className=" border border-gray-200 p-2">Website</th>
            <th className=" border border-gray-200 p-2">Address</th>

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
                    {item.name}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.supplier_description}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.first_name}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.last_name}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.mobile_no}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.telephone}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.email}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.website}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.address}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    <div className=" flex items-center justify-center h-full gap-2">
                      <button  onClick={() => handleEdit(item)}>
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
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {/* Framer Motion Box for the modal animation */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}  // Start position
        animate={{ y: 0, opacity: 1 }}     // End position
        exit={{ y: 30, opacity: 0 }}      // Close position
        transition={{ duration: 0.5 }}     // Animation duration
      >
        <Box
          sx={{
            width: '600px',
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            outline: 'none', // Removes focus outline
          }}
        >
          {/* Stepper with Green Completed Step */}
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} StepIconProps={{
                sx: {
                  color: activeStep > index ? '#512dc820' : 'inherit', 
                  opacity: activeStep < index ? '0.5' : '1'
                },
              }}>
                <StepLabel>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Render Step Content */}
          <Box >
            {renderStepContent(activeStep)}
          </Box>

          {/* Buttons for Next, Back, and Submit */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
            <Button disabled={activeStep === 0} onClick={handleBack} style={{color:'black'}}>
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleSubmit} style={{background:'black'}}>
                {editDistribution ? 'Update' : 'Finish'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext} style={{background:'black'}}>
                Next
              </Button>
            )}
          </Box>
        </Box>
      </motion.div>
    </Modal>


      </div>
    </>
  );
};

export default Supplier;
