import React, { useEffect, useState, useContext } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { useRef } from "react";
import {
  OutlinedInput,
  Typography,
} from "@mui/material";


const MiniHeader = ({ title }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const allowedRoutes = [
    "/catalogue/category-request",
    "/catalogue/category-request/",
    "/catalogue/service-request",
    "/catalogue/service-request/",
    "/catalogue/membership-type",
    "/catalogue/membership-type/",
    "/catalogue/membership-customer",
    "/catalogue/membership-customer/",
  ];

  const routeButtonNames = {
    "/catalogue/category-request": "Add category",
    "/catalogue/service-request": "Add service",
    "/catalogue/membership-type": "Add membership type",
    "/catalogue/membership-customer": "Add customer membership",
  };

  const handleOpen = () => {
    if (window.location.pathname === "/catalogue/category-request") {
      setOpen(true);
    } else if (window.location.pathname === "/catalogue/service-request") {
      setOpen(true);
    } else if (window.location.pathname === "/catalogue/membership-type") {
      navigate("/catalogue/create-membership-type");
    } else if (window.location.pathname === "/catalogue/membership-customer") {
      navigate("/catalogue/create-customer-membership");
    }
  };
  const handleClose = () => setOpen(false);

  const handleToast = (msg , type) => {
    console.log(msg , type);
    if(type === "error"){
      toast.error(msg);
    }else if(type === "success"){
      toast.success(msg);
      console.log("success");
    }
  }

  return (
    <>
    <ToastContainer />
    <div className="flex items-center justify-between h-14 w-full md:h-16 px-2 md:px-6">
      <div className="h-5 w-5 flex items-center md:hidden">
        <ArrowBackIcon className="w-full" />
      </div>
      <div>
        <h1 className="text-lg font-bold md:text-xl">{title}</h1>
      </div>
      {allowedRoutes.includes(window.location.pathname) &&
      window.innerWidth > 768 ? (
        <div className="flex gap-3 items-center">
          {/* <button className="rounded-md border border-gray-100 h-9 px-3 py-2 text-sm flex gap-2 items-center shadow bg-white cursor-not-allowed">
            Options
            <ExpandMoreIcon className="h-5 w-5" />
          </button> */}
          <button
            className="rounded-md bg-black text-white px-4 py-2 text-sm"
            onClick={handleOpen}
            disabled={!allowedRoutes.includes(window.location.pathname)}
            style={{
              cursor: !allowedRoutes.includes(window.location.pathname)
                ? "not-allowed"
                : "pointer",
            }}
          >
            {routeButtonNames[window.location.pathname] || "Add"}
          </button>
        </div>
      ) : (
        allowedRoutes.includes(window.location.pathname) && (
          <div className="flex gap-2 items-center">
            <button className="rounded-md border border-gray-300 p-1 ">
              <MoreVertIcon className="h-5 w-5" />
            </button>
            <button
              className="rounded-md border border-gray-300 p-1"
              onClick={handleOpen}
              disabled={!allowedRoutes.includes(window.location.pathname)}
              style={{
                cursor: !allowedRoutes.includes(window.location.pathname)
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              <AddIcon className="h-5 w-5" />
            </button>
          </div>
        )
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {window.location.pathname === "/catalogue/service-request" ? (
            <div className="bg-white max-w-[700px] p-[15px] rounded-xl flex flex-col gap-[20px] items-center">
              <span
                onClick={handleClose}
                className="cursor-pointer w-full flex justify-end"
              >
                <CloseIcon />
              </span>
              <ServiceModal setOpen={setOpen}
              handleToast={handleToast}
              />
            </div>
          ) : null}
          {window.location.pathname === "/catalogue/category-request" ? (
            <div className="bg-white w-full max-w-[700px] p-[15px] rounded-xl flex flex-col gap-[20px] items-center">
              <span
                onClick={handleClose}
                className="cursor-pointer w-full flex justify-end"
              >
                <CloseIcon />
              </span>
              <CategoryModal setOpen={setOpen} 
              handleToast={handleToast}
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

const CategoryModal = ({ setOpen , handleToast }) => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const [selectedMasterCategory, setSelectedMasterCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [gender, setGender] = useState("");
  const [masterCategoryData, setMasterCategoryData] = useState([]);
  const [hidden, setHidden] = useState("none");
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const navigate = useNavigate();
    const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300, // Adjust width for a cleaner look
      },
    },
  };

  const handleSubmit = async () => {
    if (!selectedMasterCategory && !gender) {
      toast.error("Please select a category");
      return;
    }

    setFormSubmitLoading(true);

    let payload = {
      from_master: selectedMasterCategory === "Other" ? false : true,
      category_name:
        selectedMasterCategory === "Other"
          ? newCategory
          : masterCategoryData.find(
              (item) => item.id === selectedMasterCategory
            )?.name,
      gender: gender,
      spa: vendorData?.spa,
    };

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/category-request/`,
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
        const responseData = await response.json();
        // toast.success("Category request submitted successfully");
        // handleToast("Category request submitted successfully" , "success");
        // setNewCategory("");
        // setSelectedMasterCategory("");
        // setGender("");
        // setOpen(false);
        // navigate("/catalogue/category-request");     
        
        // make 2 second of toast than set the state to false
        handleToast("Category request submitted successfully" , "success");
        setTimeout(() => {
          setNewCategory("");
          setSelectedMasterCategory("");
          setGender("");
          setOpen(false);
          // navigate("/catalogue/category-request");
          // this on same page i want to refresh data of other page so i will use window.location.reload
          window.location.reload();
        }, 1500);

        
      } else if (response.status === 409) {
        const responseData = await response.json();
        // toast.error(`conflict: ${responseData?.category_name}`);
        handleToast(`conflict: ${responseData?.category_name}` , "error");
      } else {
        // toast.error(`Something went wrong : ${response.status}`);
        handleToast(`Something went wrong : ${response.status}` , "error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFormSubmitLoading(false);
    }
  };

  useEffect(() => {
    selectedMasterCategory === "Other"
      ? setHidden("relative")
      : setHidden("none");
  }, [selectedMasterCategory]);

  useEffect(() => {
    const fetchMasterCategories = async () => {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spavendor/available-master-categories/?spa_id=${vendorData?.spa}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setMasterCategoryData(responseData);
        } else {
          // toast.error("There was some error while fetching data");
          handleToast("There was some error while fetching data" , "error");
        }
      } catch (error) {
        // toast.error("There was some error while fetching data");
        handleToast("There was some error while fetching data" , "error");
      }
    };
    fetchMasterCategories();
  }, []);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="master-category-label">Master Category</InputLabel>
        <Select
          labelId="master-category-label"
          id="master-category-select"
          value={selectedMasterCategory}
          label="Master Category"
          MenuProps={MenuProps}
          onChange={(e) => {
            setSelectedMasterCategory(e.target.value);
            if (e.target.value !== "Other") {
              let masCat = masterCategoryData.find(
                (item) => item.id === e.target.value
              )?.gender;
              masCat = masCat?.charAt(0).toUpperCase() + masCat?.slice(1);
              setGender(masCat);
            }
          }}
        >
          {masterCategoryData.map((item, index) => (
            <MenuItem value={item.id} key={index}>
              {`${item.name} - ( ${item?.gender} )`}
            </MenuItem>
          ))}
          <MenuItem value={"Other"}>Other</MenuItem>
        </Select>
      </FormControl>
      <TextField
        id="category-name"
        onChange={(e) => {
          setNewCategory(e.target.value);
        }}
        label="Category Name"
        variant="outlined"
        sx={{ width: "100%", display: hidden }}
      />
      <FormControl fullWidth>
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          id="gender-select"
          value={gender}
          label="Gender"
          onChange={(e) => {
            setGender(e.target.value);
          }}
          disabled={selectedMasterCategory !== "Other"}
        >
          <MenuItem value={"Male"}>Male</MenuItem>
          <MenuItem value={"Female"}>Female</MenuItem>
        </Select>
      </FormControl>
      <button
        className={`bg-black text-white w-full rounded-xl py-[10px] ${
          formSubmitLoading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => {
          console.log(formSubmitLoading);
          if (!formSubmitLoading) {
            handleSubmit();
          }
        }}
      >
        Submit
      </button>
      <ToastContainer />

    </>
  );
};

const ServiceModal = ({ setOpen , handleToast}) => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const editorRef = useRef(null);
  const [selectedSpaCategory, setSelectedSpaCategory] = useState("");
  const [selectedMasterService, setSelectedMasterServices] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [spaCategoryData, setSpaCategoryData] = useState([]);
  const [masterServiceData, setMasterServiceData] = useState(null);
  const [hiddenSer, setHiddenSer] = useState("none");
  const [timing, setTiming] = useState({
    seating: "",
    hours: "",
    minutes: "",
  });
  const [gender, setGender] = useState("");

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300, // Adjust width for a cleaner look
      },
    },
  };
  
  useEffect(() => {
    editorRef.current = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "bullet" }, { list: "ordered" }],
          [{ color: [] }],
        ],
      },
    });
  }, []);

  const handleSubmit = async () => {
    let payload = {
      category_id: selectedSpaCategory,
      spa: vendorData?.spa,
      from_masterservice: selectedMasterService === "Other" ? false : true,
      master_service:
        selectedMasterService === "Other" ? null : selectedMasterService,
      service_name:
        selectedMasterService === "Other"
          ? serviceName
          : masterServiceData.find((item) => item.id === selectedMasterService)
              ?.service_name,
      price: servicePrice,
      description: editorRef.current.root.innerHTML,
      service_time: {
        hours: timing.hours,
        minutes: timing.minutes,
        seating: timing.seating,
      },
      gender,
    };

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/service-request/`,
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
        const responseData = await response.json();
        // toast.success("Service request submitted successfully");
        // handleToast("Service request submitted successfully" , "success");
        // make 2 second of toast than set the state to false
        handleToast("Service request submitted successfully" , "success");
        setTimeout(() => {
          setServicePrice("");
          setServiceName("");
          setSelectedMasterServices("");
          setSelectedSpaCategory("");
          setTiming({
            seating: "",
            hours: "",
            minutes: "",
          });
          setGender("");
          setOpen(false);
          editorRef.current.root.innerHTML = "";
          // navigate("/catalogue/service-request");
          // this on same page i want to refresh data of other page so i will use window.location.reload
          window.location.reload();
          
        }, 1500);
       
      } else if (response.status === 409) {
        const responseData = await response.json();
        // toast.error(`conflict: ${responseData.detail}`);
        handleToast(`conflict: ${responseData.detail}` , "error");
      } else {
        // toast.error(`Something went wrong : ${response.status}`);
        handleToast(`Something went wrong : ${response.status}` , "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    selectedMasterService === "Other"
      ? setHiddenSer("relative")
      : setHiddenSer("none");
  }, [selectedMasterService]);

  useEffect(() => {
    const fetchMasterServices = async (id) => {
      if (!id) return;

      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/masterservice/?categories=${id}`,
          {
            method: "GET",
            headers: {
              // Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          setMasterServiceData(responseData?.results);
        }
      } catch (error) {
        // toast.error("There was some error while fetching data");
        handleToast("There was some error while fetching data" , "error");
      }
    };
    if (selectedSpaCategory) {
      let masterCategoryID = spaCategoryData.find(
        (item) => item.id === selectedSpaCategory
      )?.master_category_id;
      fetchMasterServices(masterCategoryID);
    }
  }, [selectedSpaCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/spas/category/",
          {
            method: "GET",
            headers: {
              // Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setSpaCategoryData(responseData);
        }
      } catch (error) {
        // toast.error("There was some error while fetching data");
        handleToast("There was some error while fetching data" , "error");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedMasterService !== "Other" && selectedMasterService) {
      let data = masterServiceData.find(
        (item) => item.id === selectedMasterService
      )?.description;
      editorRef.current.root.innerHTML = data;
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <div className=" w-full grid grid-cols-6 gap-5">
        <div className=" col-span-3 w-full h-fit">
          <FormControl fullWidth>
            <InputLabel id="spa-category-label">Select Category</InputLabel>
            <Select
              labelId="spa-category-label"
              id="spa-category-select"
              value={selectedSpaCategory}
              label="Select Category"
              MenuProps={MenuProps}
              onChange={(e) => {
                setSelectedSpaCategory(e.target.value);
                setSelectedMasterServices("");

                if (e.target.value !== "Other") {
                  let masCat = spaCategoryData.find(
                    (item) => item.id === e.target.value
                  )?.category_gender;
                  console.log(masCat);
                  masCat = masCat?.charAt(0).toUpperCase() + masCat?.slice(1);
                  console.log(masCat);
                  setGender(masCat);
                }
              }}
            >
              {spaCategoryData?.map((item, index) => (
                <MenuItem value={item.id} key={index}>
                  {item.name} ( {item?.category_gender} )
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className=" col-span-3 w-full h-fit">
          <FormControl fullWidth>
            <InputLabel id="master-service-label">Select Services</InputLabel>
            <Select
              labelId="master-service-label"
              id="master-service-select"
              MenuProps={MenuProps}
              value={selectedMasterService}
              label="Select Services"
              onChange={(e) => {
                setSelectedMasterServices(e.target.value);
              }}
            >
              {selectedSpaCategory &&
                masterServiceData?.length > 0 &&
                masterServiceData?.map((item, index) => (
                  <MenuItem value={item.id} key={index}>
                    {item.service_name} ( {item?.gender} )
                  </MenuItem>
                ))}
              <MenuItem value={"Other"}>Other</MenuItem>
            </Select>
          </FormControl>
        </div>

        <TextField
          id="service-name"
          onChange={(e) => {
            setServiceName(e.target.value);
          }}
          value={serviceName}
          label="New service name"
          variant="outlined"
          className=" col-span-6 w-full"
          sx={{ width: "100%", display: hiddenSer }}
        />

        <div className=" col-span-6 w-full">
          <label htmlFor="editor" className=" font-normal pb-2  block">
            description
          </label>
          <div id="editor" style={{ width: "100%", height: "100px" }}></div>
        </div>
        <div className=" col-span-2">
          <TextField
            id="service-time-hours"
            onChange={(e) => {
              setTiming({ ...timing, hours: e.target.value });
            }}
            value={timing.hours}
            label="Service Hours"
            variant="outlined"
            sx={{ width: "100%" }}
            type="number"
            onWheel={() => document.activeElement.blur()}
            onKeyDownCapture={(event) => {
              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
              }
            }}
          />
        </div>
        <div className=" col-span-2">
          <TextField
            id="service-time-minutes"
            onChange={(e) => {
              setTiming({ ...timing, minutes: e.target.value });
            }}
            value={timing.minutes}
            label="Service Minutes"
            variant="outlined"
            sx={{ width: "100%" }}
            type="number"
            onWheel={() => document.activeElement.blur()}
            onKeyDownCapture={(event) => {
              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
              }
            }}
          />
        </div>
        <div className=" col-span-2">
          <TextField
            id="service-seating"
            onChange={(e) => {
              setTiming({ ...timing, seating: e.target.value });
            }}
            value={timing.seating}
            label="Service Seating"
            variant="outlined"
            sx={{ width: "100%" }}
            type="number"
            onWheel={() => document.activeElement.blur()}
            onKeyDownCapture={(event) => {
              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
              }
            }}
          />
        </div>
        <div className=" col-span-3">
          <TextField
            id="service-price"
            onChange={(e) => {
              setServicePrice(e.target.value);
            }}
            value={servicePrice}
            label="Service Price"
            variant="outlined"
            sx={{ width: "100%" }}
            type="number"
            onWheel={() => document.activeElement.blur()}
            onKeyDownCapture={(event) => {
              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
              }
            }}
          />
        </div>
        <div className=" col-span-3 w-full">
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender-select"
              value={gender}
              MenuProps={MenuProps}
              label="Gender"
              onChange={(e) => {
                setGender(e.target.value);
              }}
              // disabled={selectedSpaCategory !== "Other"}
              readOnly
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className=" col-span-6 w-full">
          <button
            className="bg-[#512DC8] text-white rounded-xl py-[8px] px-4 mx-auto w-fit block"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};
