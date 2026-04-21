// import React, {
//   useState,
//   useLayoutEffect,
//   useRef,
//   useContext,
//   useEffect,
//   useMemo,
// } from "react";
// import "../css/form.css";
// import AuthContext from "../../Context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import AsyncSelect from "react-select/async";
// import Select from "react-select";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";
// import { Switch } from "@mui/material";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
// } from "@mui/material";
// import toast, { Toaster } from "react-hot-toast";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import CircularProgress from "@mui/material/CircularProgress";

// const AddService = ({ serviceData, setServiceData }) => {
//   const { authTokens, logoutUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [nextPage, setNextPage] = useState(null);
//   const [isEnabled, setIsEnabled] = useState(false);
//   const [isEnabled1, setIsEnabled1] = useState(false);
//   const [service, setService] = useState(serviceData?.service_name || "");
//   const [selectSalonId, setSelectSalonId] = useState(() => {
//     if (serviceData?.salon) {
//       return Array.isArray(serviceData.salon)
//         ? serviceData.salon
//         : [serviceData.salon];
//     }
//     return [];
//   });
//   const [selectedSalons, setSelectedSalons] = useState(() => {
//     if (serviceData) {
//       return (
//         {
//           value: serviceData?.salon,
//           label: serviceData?.salon_name,
//         } || null
//       );
//     } else {
//       return null;
//     }
//   });
//   const [discount, setDiscount] = useState(0);
//   const [price, setPrice] = useState(serviceData?.price || 0);
//   const [categoryList, setCategoryList] = useState([]);
//   const [categoryId, setCategoryId] = useState(serviceData?.categories || null);
//   const [cityPayload, setCityPayload] = useState([]);
//   const [selectedCity, setSelectedCity] = useState(serviceData?.city || "");
//   const [city, setCity] = useState([]);
//   const [masterServiceData, setMasterServiceData] = useState([]);
//   const [masterServiceId, setMasterServiceId] = useState(
//     serviceData?.master_service || ""
//   );
//   const [serviceTime, setServiceTime] = useState(() => {
//     if (serviceData?.service_time) {
//       return {
//         Total_days: serviceData.service_time.days || null,
//         Total_hours: serviceData.service_time.hours || null,
//         Total_minutes: serviceData.service_time.minutes || null,
//         Total_seating: serviceData.service_time.seating || null,
//       };
//     }
//     return {
//       Total_days: null,
//       Total_hours: null,
//       Total_minutes: null,
//       Total_seating: null,
//     };
//   });
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [showMasterForm, setShowMasterForm] = useState(false);

//   // Master Service Form States
//   const [masterGender, setMasterGender] = useState("");
//   const [masterServiceName, setMasterServiceName] = useState("");
//   const [masterCategoryList, setMasterCategoryList] = useState([]);
//   const [masterCategoryId, setMasterCategoryId] = useState("");
//   const [masterImg, setMasterImg] = useState(null);
//   const [masterServiceTime, setMasterServiceTime] = useState({
//     Total_days: null,
//     Total_hours: null,
//     Total_minutes: null,
//     Total_seating: null,
//   });

//   const editorRef = useRef(null);
//   const masterEditorRef = useRef(null);
//   const [openConfirm, setOpenConfirm] = useState(false);

//   /* ------------------- Length Selection State - UPDATED ------------------- */
//   const [selectedLengthType, setSelectedLengthType] = useState(""); // Controls dropdown
//   const [lengthOptions, setLengthOptions] = useState({
//     short: { checked: false, price: "" },
//     medium: { checked: false, price: "" },
//     long: { checked: false, price: "" },
//     custom: { name: "", price: "", checked: true }, // custom always "checked" if name exists
//   });

//   const [lengthTimes, setLengthTimes] = useState({
//     short: { Total_days: "", Total_hours: "", Total_minutes: "", Total_seating: "" },
//     medium: { Total_days: "", Total_hours: "", Total_minutes: "", Total_seating: "" },
//     long: { Total_days: "", Total_hours: "", Total_minutes: "", Total_seating: "" },
//     custom: { Total_days: "", Total_hours: "", Total_minutes: "", Total_seating: "" },
//   });

//   // New state for tracking checked lengths with prices
//   const [checkedLengths, setCheckedLengths] = useState([]);

//   /* ------------------- CITY, SALON, CATEGORY, MASTER-SERVICE ------------------- */
//   const getCity = async () => {
//     let url = `https://backendapi.trakky.in/salons/city/`;
//     await fetch(url)
//       .then((res) => res.json())
//       .then((data) => {
//         setCityPayload(data?.payload);
//         setCity(data?.payload.map((item) => item.name));
//       })
//       .catch((err) => console.error(err));
//   };

//   const loadSalons = async (inputValue, callback) => {
//     if (!inputValue || inputValue.trim() === "") {
//       callback([]);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
//           inputValue
//         )}&city=${selectedCity}`
//       );
//       if (!response.ok) throw new Error(`HTTP ${response.status}`);
//       const data = await response.json();
//       const options = data?.results?.map((salon) => ({
//         value: salon.id,
//         label: salon.name,
//       }));
//       callback(options);
//     } catch (error) {
//       console.error("Error fetching salons:", error);
//       callback([]);
//     }
//   };

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     toast.loading("Refreshing categories...");
//     try {
//       setCategoryId("");
//       setMasterServiceId("");
//       editorRef.current.root.innerHTML = "";
//       await getCategories(selectSalonId, false);
//       toast.dismiss();
//       toast.success("Categories refreshed successfully.");
//     } catch (error) {
//       toast.dismiss();
//       toast.error("Failed to refresh categories.");
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   const getCategories = (selectSalonIds, single) => {
//     const requestOption = {
//       method: "GET",
//       headers: {
//         Authorization: "Bearer " + `${authTokens.access}`,
//         "Content-Type": "application/json",
//       },
//     };

//     let salonIdsQueryString;
//     if (single) {
//       const id = Array.isArray(selectSalonIds)
//         ? selectSalonIds[0]
//         : selectSalonIds;
//       salonIdsQueryString = id;
//     } else {
//       salonIdsQueryString = Array.isArray(selectSalonIds)
//         ? selectSalonIds.join(",")
//         : selectSalonIds;
//     }

//     return fetch(
//       `https://backendapi.trakky.in/salons/category/?salon_id=${salonIdsQueryString}`,
//       requestOption
//     )
//       .then((res) => res.json())
//       .then((data) => setCategoryList(data))
//       .catch((err) => console.error(err));
//   };

//   const getMasterServices = async (masterCategoryId) => {
//     if (!masterCategoryId) return;

//     try {
//       let url = `https://backendapi.trakky.in/salons/masterservice/?categories=${masterCategoryId}`;
//       const requestOption = {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer " + `${authTokens.access}`,
//           "Content-Type": "application/json",
//         },
//       };

//       const response = await fetch(url, requestOption);
//       if (response.status === 401) {
//         toast.error("Session expired");
//         logoutUser();
//       } else if (response.status === 200) {
//         const data = await response.json();
//         setNextPage(data?.next);
//         setMasterServiceData(data?.results || []);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getMasterCategories = async (selectedgender) => {
//     try {
//       let url = "https://backendapi.trakky.in/salons/mastercategory/";
//       if (selectedgender) url += `?gender=${selectedgender}`;

//       const requestOption = {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer " + `${authTokens.access}`,
//           "Content-Type": "application/json",
//         },
//       };

//       const response = await fetch(url, requestOption);
//       if (response.status === 200) {
//         const data = await response.json();
//         setMasterCategoryList(data);
//       } else if (response.status === 401) {
//         toast.error("Unauthorized access. Please log in again.", {
//           duration: 4000,
//           position: "top-center",
//           style: { borderRadius: "10px", background: "#333", color: "#fff" },
//         });
//       } else {
//         toast.error(`Error : ${response.status} - ${response.statusText}`, {
//           duration: 4000,
//           position: "top-center",
//           style: { borderRadius: "10px", background: "#333", color: "#fff" },
//         });
//       }
//     } catch (error) {
//       toast.error("Failed to fetch categories. Please try again later.", {
//         duration: 4000,
//         position: "top-center",
//         style: { borderRadius: "10px", background: "#333", color: "#fff" },
//       });
//     }
//   };

//   /* ------------------- EFFECTS ------------------- */
//   useEffect(() => {
//     const loadCities = async () => {
//       await getCity();
//     };
//     loadCities();
//   }, []);
//   useEffect(() => {
//     const loadInitialCategories = async () => {
//       if (serviceData) {
//         await getCategories(selectSalonId, true);
//       }
//     };
//     loadInitialCategories();
//   }, []);
//   useEffect(() => {
//     const loadCategories = async () => {
//       if (selectSalonId.length > 0) {
//         await getCategories(selectSalonId);
//       }
//     };
//     loadCategories();
//   }, [selectSalonId]);
//   useEffect(() => {
//     const loadMasterServices = async () => {
//       const selectedCategory = categoryList.find(
//         (item) => item.id === parseInt(categoryId)
//       );
//       if (selectedCategory)
//         await getMasterServices(selectedCategory.master_category_id);
//     };
//     loadMasterServices();
//   }, [categoryId, categoryList]);

//   // Update checkedLengths whenever lengthOptions changes
//   useEffect(() => {
//     const checked = [];
//     if (lengthOptions.short.checked && lengthOptions.short.price) {
//       checked.push({
//         type: "Short",
//         price: lengthOptions.short.price,
//         key: "short"
//       });
//     }
//     if (lengthOptions.medium.checked && lengthOptions.medium.price) {
//       checked.push({
//         type: "Medium",
//         price: lengthOptions.medium.price,
//         key: "medium"
//       });
//     }
//     if (lengthOptions.long.checked && lengthOptions.long.price) {
//       checked.push({
//         type: "Long",
//         price: lengthOptions.long.price,
//         key: "long"
//       });
//     }
//     if (lengthOptions.custom.name && lengthOptions.custom.price) {
//       checked.push({
//         type: lengthOptions.custom.name,
//         price: lengthOptions.custom.price,
//         key: "custom"
//       });
//     }
//     setCheckedLengths(checked);
//   }, [lengthOptions]);

//   useEffect(() => {
//     editorRef.current = new Quill("#editor", {
//       theme: "snow",
//       modules: {
//         toolbar: [
//           ["bold", "italic", "underline", "strike"],
//           [{ list: "bullet" }],
//         ],
//       },
//     });
//     if (serviceData?.description)
//       editorRef.current.root.innerHTML = serviceData.description;

//     const handleTextChange = () => {
//       const content = editorRef.current.root.innerHTML;
//       const cleaned = cleanContent(content);
//       if (cleaned !== content) {
//         editorRef.current.root.innerHTML = cleaned;
//         const range = editorRef.current.getSelection();
//         if (range) editorRef.current.setSelection(range.index, 0);
//         else
//           editorRef.current.setSelection(
//             editorRef.current.getLength() - 1,
//             0
//           );
//       }
//     };

//     editorRef.current.on("text-change", handleTextChange);

//     return () => {
//       if (editorRef.current) {
//         editorRef.current.off("text-change", handleTextChange);
//         editorRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     let masterQuill = null;
//     if (showMasterForm) {
//       masterQuill = new Quill("#master-editor", {
//         theme: "snow",
//         modules: {
//           toolbar: [
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "bullet" }],
//           ],
//         },
//       });

//       const handleMasterTextChange = () => {
//         const content = masterQuill.root.innerHTML;
//         const cleaned = cleanContent(content);
//         if (cleaned !== content) {
//           masterQuill.root.innerHTML = cleaned;
//           const range = masterQuill.getSelection();
//           if (range) masterQuill.setSelection(range.index, 0);
//           else
//             masterQuill.setSelection(
//               masterQuill.getLength() - 1,
//               0
//             );
//         }
//       };

//       masterQuill.on("text-change", handleMasterTextChange);
//       masterEditorRef.current = masterQuill;
//     }

//     return () => {
//       if (masterQuill) {
//         masterQuill.off("text-change");
//         masterQuill = null;
//       }
//       masterEditorRef.current = null;
//     };
//   }, [showMasterForm]);

//   useEffect(() => {
//     const loadMasterCategories = async () => {
//       if (showMasterForm && masterGender) {
//         await getMasterCategories(masterGender);
//       }
//     };
//     loadMasterCategories();
//   }, [showMasterForm, masterGender]);

//   const fetchMoreServices = async () => {
//     if (!nextPage) return;

//     try {
//       const response = await fetch(nextPage);
//       if (!response.ok) throw new Error("Failed");
//       const data = await response.json();
//       setMasterServiceData((prev) => [...prev, ...data.results]);
//       setNextPage(data?.next || null);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     const loadMore = async () => {
//       if (nextPage) {
//         await fetchMoreServices();
//       }
//     };
//     loadMore();
//   }, [nextPage]);

//   useEffect(() => {
//     if (masterServiceId && masterServiceData.length > 0) {
//       const selectedService = masterServiceData.find(
//         (svc) => svc.id === parseInt(masterServiceId)
//       );
//       if (selectedService) {
//         setServiceTime({
//           Total_days: selectedService.Total_days ?? null,
//           Total_hours: selectedService.Total_hours ?? null,
//           Total_minutes: selectedService.Total_minutes ?? null,
//           Total_seating: selectedService.Total_seating ?? null,
//         });
//       }
//     }
//   }, [masterServiceId, masterServiceData]);

//   /* ------------------- HANDLERS ------------------- */
//   const handleSelectChange = (selectedOptions) => {
//     setSelectedSalons(selectedOptions);
//     setSelectSalonId(
//       selectedOptions
//         ? Array.isArray(selectedOptions)
//           ? selectedOptions.map((opt) => opt.value)
//           : [selectedOptions.value]
//         : []
//     );
//   };

//   const handleCategoryChange = (selected) => {
//     setCategoryId(selected?.value || "");
//     setMasterServiceId("");
//     editorRef.current.root.innerHTML = "";
//   };

//   const handleServiceChange = (selected) => {
//     setMasterServiceId(selected?.value || "");
//     editorRef.current.root.innerHTML = selected?.description || "";
//   };

//   const cleanContent = (content) =>
//     content
//       .replace(/\s+/g, " ")
//       .replace(/(?:\r\n|\r|\n)+/g, "<br>")
//       .replace(/<p><\/p>/g, "")
//       .replace(/<br\s*\/?>/g, "")
//       .trim();

//   /* ------------------- Length Handlers ------------------- */
//   const handleLengthCheckboxChange = (type) => {
//     const key = type.toLowerCase();
//     setLengthOptions({
//       ...lengthOptions,
//       [key]: {
//         ...lengthOptions[key],
//         checked: !lengthOptions[key].checked,
//       },
//     });
//   };

//   const handleLengthPriceChange = (type, price) => {
//     const key = type.toLowerCase();
//     setLengthOptions({
//       ...lengthOptions,
//       [key]: {
//         ...lengthOptions[key],
//         price: price,
//       },
//     });
//   };

//   const handleCustomLengthChange = (name, price) => {
//     setLengthOptions({
//       ...lengthOptions,
//       custom: {
//         ...lengthOptions.custom,
//         name: name,
//         price: price,
//       },
//     });
//   };

//   /* ------------------- MAIN SERVICE SUBMIT ------------------- */
// const handleSubmit = async (event) => {
//   event.preventDefault();

//   const description = editorRef.current.root.innerHTML;
//   const cleanedDescription = cleanContent(description);

//   const formData = new FormData();
//   if (serviceData) {
//     formData.append("salon", selectSalonId[0] || selectSalonId);
//   } else {
//     selectSalonId.forEach((id) => formData.append("salon_ids", id));
//   }

//   formData.append("description", cleanedDescription);
//   formData.append("price", price);
//   formData.append("discount", discount);
//   formData.append("categories", categoryId);
//   formData.append("master_service", masterServiceId);

//   const lengths = [];
//   if (lengthOptions.short.checked && lengthOptions.short.price) {
//     lengths.push({
//       type: "Short",
//       price: lengthOptions.short.price,
//       time: lengthTimes.short,
//     });
//   }
//   if (lengthOptions.medium.checked && lengthOptions.medium.price) {
//     lengths.push({
//       type: "Medium",
//       price: lengthOptions.medium.price,
//       time: lengthTimes.medium,
//     });
//   }
//   if (lengthOptions.long.checked && lengthOptions.long.price) {
//     lengths.push({
//       type: "Long",
//       price: lengthOptions.long.price,
//       time: lengthTimes.long,
//     });
//   }
//   if (lengthOptions.custom.name && lengthOptions.custom.price) {
//     lengths.push({
//       type: lengthOptions.custom.name,
//       price: lengthOptions.custom.price,
//       time: lengthTimes.custom,
//     });
//   }

//   formData.append("lengths", JSON.stringify(lengths));

//   const serviceTimePayload = {
//     days: serviceTime?.Total_days || 0,
//     hours: serviceTime?.Total_hours || 0,
//     minutes: serviceTime?.Total_minutes || "",
//     seating: serviceTime?.Total_seating || 0,
//   };

//   formData.append("service_time", JSON.stringify(serviceTimePayload));

//   const url = serviceData
//     ? `https://backendapi.trakky.in/salons/service/${serviceData.id}/`
//     : `https://backendapi.trakky.in/salons/service/`;
//   const method = serviceData ? "PATCH" : "POST";

//   try {
//     let response = await fetch(url, {
//       method,
//       headers: {
//         Authorization: "Bearer " + String(authTokens.access),
//       },
//       body: formData,
//     });

//     // Handle unauthorized
//     if (response.status === 401) {
//       toast.error("You're logged out");
//       logoutUser();
//       return;
//     }

//     // Handle validation or conflict errors (like duplicate service)
//     if (!response.ok) {
//       try {
//         const errorData = await response.json();
//         // Show the exact backend message (e.g., "Service already exists...")
//         if (errorData.error) {
//           toast.error(errorData.error);
//         } else if (errorData.detail) {
//           toast.error(errorData.detail);
//         } else {
//           toast.error("Something went wrong. Please try again.");
//         }
//       } catch (parseError) {
//         toast.error(`Error: ${response.status} - ${response.statusText}`);
//       }
//       return;
//     }

//     // Success
//     if (response.status === 200 || response.status === 201) {
//       toast.success(
//         serviceData
//           ? "Service updated successfully."
//           : "Service added successfully."
//       );
//       if (setServiceData) {
//         setServiceData(serviceData);
//       }
//     }
//   } catch (error) {
//     console.error("Network error:", error);
//     toast.error("Network error - Please check your connection.");
//   }
// };


//   /* ------------------- MASTER SERVICE SUBMIT ------------------- */
//   const handleMasterSubmit = async (event) => {
//     event.preventDefault();

//     if (!masterImg) {
//       toast.error("Please upload a service image");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("service_name", masterServiceName);
//     formData.append(
//       "description",
//       cleanContent(masterEditorRef.current.root.innerHTML)
//     );
//     formData.append("gender", masterGender);
//     formData.append("categories", masterCategoryId);
//     formData.append("Total_days", masterServiceTime?.Total_days);
//     formData.append("Total_hours", masterServiceTime?.Total_hours);
//     formData.append("Total_minutes", masterServiceTime?.Total_minutes);
//     formData.append("Total_seating", masterServiceTime?.Total_seating);
//     formData.append("service_image", masterImg);

//     try {
//       const response = await fetch(
//         "https://backendapi.trakky.in/salons/masterservice/",
//         {
//           method: "POST",
//           headers: {
//             Authorization: "Bearer " + `${authTokens.access}`,
//           },
//           body: formData,
//         }
//       );

//       if (response.status === 201) {
//         const data = await response.json();
//         toast.success("Master service added successfully");
//         const selectedCat = categoryList.find(
//           (c) => c.id === parseInt(categoryId)
//         );
//         if (
//           selectedCat &&
//           masterCategoryId == selectedCat.master_category_id
//         ) {
//           setMasterServiceData((prev) => [...prev, data]);
//           setMasterServiceId(data.id);
//           editorRef.current.root.innerHTML = data.description || "";
//         }
//         setMasterCategoryId("");
//         setMasterGender("");
//         setMasterServiceName("");
//         setMasterImg(null);
//         setMasterServiceTime({
//           Total_days: null,
//           Total_hours: null,
//           Total_minutes: null,
//           Total_seating: null,
//         });
//         masterEditorRef.current.root.innerHTML = "";
//       } else if (response.status === 401) {
//         toast.error("You're logged out");
//         logoutUser();
//       } else {
//         toast.error(`Error: ${response.status}`);
//       }
//     } catch (error) {
//       toast.error("Failed to add master service.");
//     }
//   };

//   const handleOpenConfirm = () => setOpenConfirm(true);
//   const handleCloseConfirm = () => setOpenConfirm(false);
//   const handleConfirmClose = () => {
//     setShowMasterForm(false);
//     setOpenConfirm(false);
//   };

//   const handleToggleMasterForm = () => {
//     if (showMasterForm) handleOpenConfirm();
//     else setShowMasterForm(true);
//   };

//   /* ------------------- MEMOIZED OPTIONS ------------------- */
//   const categoryOptions = useMemo(
//     () =>
//       categoryList?.map((cat) => ({
//         value: cat.id,
//         label: `${cat.category_name} (${cat.category_gender}) - ${cat.city}`,
//         master_category_id: cat.master_category_id,
//       })),
//     [categoryList]
//   );

//   const masterServiceOptions = useMemo(
//     () =>
//       masterServiceData.map((svc) => ({
//         value: svc.id,
//         label: `${svc.service_name} (${svc.gender})`,
//         description: svc.description || "",
//       })),
//     [masterServiceData]
//   );

//   const selectedCategoryOption = useMemo(
//     () =>
//       categoryOptions.find((opt) => opt.value === parseInt(categoryId)) ||
//       null,
//     [categoryOptions, categoryId]
//   );

//   const selectedServiceOption = useMemo(
//     () =>
//       masterServiceOptions.find(
//         (opt) => opt.value === parseInt(masterServiceId)
//       ) || null,
//     [masterServiceOptions, masterServiceId]
//   );

//   /* ------------------- RENDER ------------------- */
//   return (
//     <>
//       <Toaster />
//       <button
//         type="button"
//         onClick={handleToggleMasterForm}
//         className="border p-2 border-slate-400 relative rounded-md mt-2 bg-blue-500 text-white mb-4"
//         style={{ marginLeft: "auto", display: "block" }}
//       >
//         {showMasterForm ? "Close Master Service Form" : "Add Master Service"}
//       </button>
//       <div className="form-container">
//         <div
//           className={showMasterForm ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}
//         >
//           <form
//             method="post"
//             onSubmit={handleSubmit}
//             className={showMasterForm ? "col-span-1" : ""}
//           >
//             <div className="row">
//               <h3 className="form-title">
//                 {serviceData ? "Update" : "Add"} Service
//               </h3>
//             </div>

//             {/* City */}
//             <div className="row">
//               <div className="input-box inp-id col-1 col-2">
//                 <label htmlFor="id">Select City</label>
//                 <select
//                   disabled={serviceData !== undefined}
//                   name="id"
//                   id="id"
//                   value={selectedCity}
//                   onChange={(e) => {
//                     setCategoryList([]);
//                     setCategoryId("");
//                     setMasterServiceId("");
//                     editorRef.current.root.innerHTML = "";
//                     setSelectedSalons(null);
//                     setSelectedCity(e.target.value);
//                   }}
//                 >
//                   <option value="">Select City</option>
//                   {city.map((item, index) => (
//                     <option key={index} value={item}>
//                       {item}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Salon */}
//             <div className="row">
//               <div className="input-box inp-salon col-1 col-2 relative">
//                 <label htmlFor="salons">
//                   Select Salon
//                   <span className="Note_Inp_Classs">
//                     Salon Must belongs to Selected city
//                   </span>
//                 </label>
//                 <AsyncSelect
//                   isDisabled={serviceData !== undefined}
//                   isMulti={!serviceData}
//                   cacheOptions
//                   defaultOptions
//                   loadOptions={loadSalons}
//                   onChange={handleSelectChange}
//                   value={selectedSalons}
//                   placeholder="Search salons..."
//                   noOptionsMessage={() => "Type to search salons"}
//                 />
//               </div>
//             </div>

//             {/* Category */}
//             <div className="row">
//               <div className="input-box inp-time col-1">
//                 <label htmlFor="category">
//                   Select Category
//                   <span className="Note_Inp_Classs">
//                     Make Sure Selected Category Present In Selected Salon
//                   </span>
//                 </label>
//                 <div className="">
//                   <Select
//                     options={categoryOptions}
//                     value={selectedCategoryOption}
//                     onChange={handleCategoryChange}
//                     placeholder="Search categories..."
//                     isDisabled={!selectSalonId || selectSalonId.length === 0}
//                     noOptionsMessage={() => "No categories available"}
//                     styles={{ control: (base) => ({ ...base, flexGrow: 1 }) }}
//                   />
//                   <button
//                     type="button"
//                     onClick={handleRefresh}
//                     className={`border mt-3 p-1 border-slate-400 rounded-md ${
//                       isRefreshing ? "bg-gray-400" : ""
//                     }`}
//                     disabled={selectSalonId.length === 0 || isRefreshing}
//                   >
//                     {isRefreshing ? (
//                       <CircularProgress size={20} />
//                     ) : (
//                       <RefreshIcon />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Master Service */}
//             <div className="row">
//               <div className="input-box inp-time col-1 col-2">
//                 <label htmlFor="service">Select Service</label>
//                 <Select
//                   options={masterServiceOptions}
//                   value={selectedServiceOption}
//                   onChange={handleServiceChange}
//                   placeholder="Search services..."
//                   isDisabled={!categoryId}
//                   noOptionsMessage={() => "No services available"}
//                 />
//               </div>
//             </div>

       

//             {/* Description */}
//             <div className="row">
//               <div className="input-box inp-name col-1 col-2">
//                 <label htmlFor="content">Description</label>
//                 <div
//                   id="editor"
//                   style={{ width: "100%", height: "100px" }}
//                 ></div>
//               </div>
//             </div>

//             {/* Price & Discount */}
//             <div className="row">
//               <div className="input-box inp-price col-1 col-2">
//                 <label htmlFor="price">Price</label>
//                 <input
//                   type="number"
//                   name="price"
//                   id="price"
//                   placeholder="Enter Price"
//                   min={0}
//                   value={price}
//                   onChange={(e) =>
//                     setPrice(e.target.value < 0 ? 0 : e.target.value)
//                   }
//                   onWheel={(e) => e.target.blur()}
//                   onKeyDown={(e) =>
//                     ["ArrowUp", "ArrowDown"].includes(e.key) &&
//                     e.preventDefault()
//                   }
//                 />
//               </div>
//             </div>

//             <div className="row">
//               <div className="input-box inp-discount col-1 col-2">
//                 <label htmlFor="discount">Discount Price</label>
//                 <input
//                   type="number"
//                   name="discount"
//                   id="discount"
//                   placeholder="Enter Discount"
//                   value={discount}
//                   min={0}
//                   required
//                   onChange={(e) =>
//                     setDiscount(e.target.value < 0 ? 0 : e.target.value)
//                   }
//                   onWheel={(e) => e.target.blur()}
//                   onKeyDown={(e) =>
//                     ["ArrowUp", "ArrowDown"].includes(e.key) &&
//                     e.preventDefault()
//                   }
//                 />
//               </div>
//             </div>

//             {/* Old Service Time */}
//             <div className="row col-2 !gap-4 !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4">
//               <div className="input-box inp-time col-1">
//                 <label htmlFor="service-time" style={{ fontSize: "16px" }}>
//                   Total Hours
//                 </label>
//                 <input
//                   type="number"
//                   value={serviceTime?.Total_hours || ""}
//                   placeholder="Hours: 0, 1, 2..."
//                   onChange={(e) =>
//                     setServiceTime({
//                       ...serviceTime,
//                       Total_hours: e.target.value,
//                     })
//                   }
//                   onWheel={(e) => e.target.blur()}
//                   onKeyDown={(e) =>
//                     ["ArrowUp", "ArrowDown"].includes(e.key) &&
//                     e.preventDefault()
//                   }
//                 />
//               </div>
//               <div className="input-box inp-time col-1">
//                 <label htmlFor="service-time">Total Minutes</label>
//                 <input
//                   type="number"
//                   value={serviceTime?.Total_minutes || ""}
//                   style={{ marginTop: "5px" }}
//                   placeholder="Minutes: 0, 15, 30..."
//                   onChange={(e) =>
//                     setServiceTime({
//                       ...serviceTime,
//                       Total_minutes: e.target.value,
//                     })
//                   }
//                   onWheel={(e) => e.target.blur()}
//                   onKeyDown={(e) =>
//                     ["ArrowUp", "ArrowDown"].includes(e.key) &&
//                     e.preventDefault()
//                   }
//                 />
//               </div>
//               <div className="input-box inp-time col-1">
//                 <label htmlFor="service-time" style={{ fontSize: "16px" }}>
//                   Total Seating
//                 </label>
//                 <input
//                   type="number"
//                   value={serviceTime?.Total_seating || ""}
//                   placeholder="Seating: 0, 1, 2..."
//                   onChange={(e) =>
//                     setServiceTime({
//                       ...serviceTime,
//                       Total_seating: e.target.value,
//                     })
//                   }
//                   onWheel={(e) => e.target.blur()}
//                   onKeyDown={(e) =>
//                     ["ArrowUp", "ArrowDown"].includes(e.key) &&
//                     e.preventDefault()
//                   }
//                 />
//               </div>
//               <div className="input-box inp-time col-1">
//                 <label htmlFor="service-time">Total Days</label>
//                 <input
//                   type="number"
//                   value={serviceTime?.Total_days || ""}
//                   style={{ marginTop: "5px" }}
//                   placeholder="Days: 0, 1, 2..."
//                   onChange={(e) =>
//                     setServiceTime({
//                       ...serviceTime,
//                       Total_days: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>

//             <div className="submit-btn row">
//               <button type="submit">Submit</button>
//             </div>
//           </form>

//           {/* Master Service Form (unchanged) */}
//           {showMasterForm && (
//             <div className="col-span-1">
//               <form method="post" onSubmit={handleMasterSubmit}>
//                 <div className="row">
//                   <h3 className="form-title">Add Master Services</h3>
//                 </div>
//                 <div className="row">
//                   <div className="input-box inp-time col-1 col-2">
//                     <label htmlFor="master-gender">Select Gender</label>
//                     <select
//                       name="gender"
//                       id="master-gender"
//                       required
//                       value={masterGender || "not-select"}
//                       onChange={(e) => {
//                         setMasterCategoryId("");
//                         setMasterGender(e.target.value);
//                       }}
//                     >
//                       <option value="not-select" disabled hidden>
//                         ---Select---
//                       </option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="input-box inp-time col-1 col-2">
//                     <label htmlFor="master-category">Select Category</label>
//                     <select
//                       name="category"
//                       id="master-category"
//                       required
//                       value={masterCategoryId || "not-select"}
//                       onChange={(e) => setMasterCategoryId(e.target.value)}
//                     >
//                       <option value="not-select" disabled hidden>
//                         ---Select---
//                       </option>
//                       {masterCategoryList?.map((category, index) => (
//                         <option value={category.id} key={index}>
//                           {category.name} ({category.gender})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="input-box inp-service col-1 col-2">
//                     <label htmlFor="master-service-name">Service Name</label>
//                     <input
//                       type="text"
//                       name="service-name"
//                       id="master-service-name"
//                       placeholder="Enter Service Name"
//                       required
//                       value={masterServiceName}
//                       onChange={(e) => setMasterServiceName(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="input-box inp-name col-1 col-2">
//                     <label htmlFor="master-content">Description</label>
//                     <div
//                       id="master-editor"
//                       style={{ width: "100%", height: "100px" }}
//                     ></div>
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="input-box inp-main-img col-1 col-2">
//                     <label>
//                       Service Image{" "}
//                       <span className="Note_Inp_Classs">
//                         Recommended Image Ratio 1:1
//                       </span>
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       required
//                       onChange={(e) => setMasterImg(e.target.files[0])}
//                     />
//                   </div>
//                 </div>
//                 <div className="submit-btn row">
//                   <button type="submit">Submit</button>
//                 </div>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>

//       <Dialog
//         open={openConfirm}
//         onClose={handleCloseConfirm}
//         aria-labelledby="confirm-dialog-title"
//       >
//         <DialogTitle id="confirm-dialog-title">Confirm Close</DialogTitle>
//         <DialogContent>
//           Are you sure you want to close the Master Service Form?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseConfirm} color="primary">
//             No
//           </Button>
//           <Button onClick={handleConfirmClose} color="error" autoFocus>
//             Yes, Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default AddService;


import React, {
  useState,
  useLayoutEffect,
  useRef,
  useContext,
  useEffect,
  useMemo,
} from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Switch } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";

const AddService = ({ serviceData, setServiceData }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [nextPage, setNextPage] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [service, setService] = useState(serviceData?.service_name || "");
  const [selectSalonId, setSelectSalonId] = useState(() => {
    if (serviceData?.salon) {
      return Array.isArray(serviceData.salon)
        ? serviceData.salon
        : [serviceData.salon];
    }
    return [];
  });
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (serviceData) {
      return (
        {
          value: serviceData?.salon,
          label: serviceData?.salon_name,
        } || null
      );
    } else {
      return null;
    }
  });
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(serviceData?.price || 0);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState(serviceData?.categories || null);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(serviceData?.city || "");
  const [city, setCity] = useState([]);
  const [masterServiceData, setMasterServiceData] = useState([]);
  const [masterServiceId, setMasterServiceId] = useState(
    serviceData?.master_service || ""
  );
  const [serviceTime, setServiceTime] = useState(() => {
    if (serviceData?.service_time) {
      return {
        Total_days: serviceData.service_time.days || null,
        Total_hours: serviceData.service_time.hours || null,
        Total_minutes: serviceData.service_time.minutes || null,
        Total_seating: serviceData.service_time.seating || null,
      };
    }
    return {
      Total_days: null,
      Total_hours: null,
      Total_minutes: null,
      Total_seating: null,
    };
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMasterForm, setShowMasterForm] = useState(false);

  // Master Service Form States
  const [masterGender, setMasterGender] = useState("");
  const [masterServiceName, setMasterServiceName] = useState("");
  const [masterCategoryList, setMasterCategoryList] = useState([]);
  const [masterCategoryId, setMasterCategoryId] = useState("");
  const [masterImg, setMasterImg] = useState(null);
  const [masterServiceTime, setMasterServiceTime] = useState({
    Total_days: null,
    Total_hours: null,
    Total_minutes: null,
    Total_seating: null,
  });

  const editorRef = useRef(null);
  const masterEditorRef = useRef(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  /* ------------------- NEW: Choose Length Feature ------------------- */
  const [selectedLength, setSelectedLength] = useState(""); // Current dropdown selection
  const [customLengthName, setCustomLengthName] = useState("");
  const [lengthPrice, setLengthPrice] = useState("");
  const [lengthTiming, setLengthTiming] = useState({
    Total_days: "",
    Total_hours: "",
    Total_minutes: "",
    Total_seating: "",
  });

  const [addedLengths, setAddedLengths] = useState([]); // Final list of added lengths

  const lengthOptions = [
    { value: "Short", label: "Short" },
    { value: "Medium", label: "Medium" },
    { value: "Long", label: "Long" },
    { value: "Custom", label: "Custom" },
  ];

  const handleAddLength = () => {
    if (!selectedLength || !lengthPrice) {
      toast.error("Please select length and enter price");
      return;
    }

    let lengthKey = selectedLength;
    if (selectedLength === "Custom" && !customLengthName.trim()) {
      toast.error("Please enter custom length name");
      return;
    }
    if (selectedLength === "Custom") {
      lengthKey = customLengthName.trim();
    }

    // Check duplicate
    if (addedLengths.some((item) => Object.keys(item)[0] === lengthKey)) {
      toast.error(`${lengthKey} length already added`);
      return;
    }

    const newLengthEntry = {
      [lengthKey]: {
        price: lengthPrice,
        timing: {
          Total_days: lengthTiming.Total_days || "0",
          Total_hours: lengthTiming.Total_hours || "0",
          Total_minutes: lengthTiming.Total_minutes || "0",
          Total_seating: lengthTiming.Total_seating || "0",
        },
      },
    };

    setAddedLengths([...addedLengths, newLengthEntry]);

    // Reset fields
    setSelectedLength("");
    setCustomLengthName("");
    setLengthPrice("");
    setLengthTiming({
      Total_days: "",
      Total_hours: "",
      Total_minutes: "",
      Total_seating: "",
    });
    toast.success(`${lengthKey} length added`);
  };

  const handleRemoveLength = (lengthKey) => {
    setAddedLengths(addedLengths.filter((item) => Object.keys(item)[0] !== lengthKey));
    toast.success(`${lengthKey} removed`);
  };

  /* ------------------- CITY, SALON, CATEGORY, MASTER-SERVICE ------------------- */
  const getCity = async () => {
    let url = `https://backendapi.trakky.in/salons/city/`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityPayload(data?.payload);
        setCity(data?.payload.map((item) => item.name));
      })
      .catch((err) => console.error(err));
  };

  const loadSalons = async (inputValue, callback) => {
    if (!inputValue || inputValue.trim() === "") {
      callback([]);
      return;
    }
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
          inputValue
        )}&city=${selectedCity}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const options = data?.results?.map((salon) => ({
        value: salon.id,
        label: salon.name,
      }));
      callback(options);
    } catch (error) {
      console.error("Error fetching salons:", error);
      callback([]);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.loading("Refreshing categories...");
    try {
      setCategoryId("");
      setMasterServiceId("");
      editorRef.current.root.innerHTML = "";
      await getCategories(selectSalonId, false);
      toast.dismiss();
      toast.success("Categories refreshed successfully.");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to refresh categories.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getCategories = (selectSalonIds, single) => {
    const requestOption = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + `${authTokens.access}`,
        "Content-Type": "application/json",
      },
    };
    let salonIdsQueryString;
    if (single) {
      const id = Array.isArray(selectSalonIds)
        ? selectSalonIds[0]
        : selectSalonIds;
      salonIdsQueryString = id;
    } else {
      salonIdsQueryString = Array.isArray(selectSalonIds)
        ? selectSalonIds.join(",")
        : selectSalonIds;
    }
    return fetch(
      `https://backendapi.trakky.in/salons/category/?salon_id=${salonIdsQueryString}`,
      requestOption
    )
      .then((res) => res.json())
      .then((data) => setCategoryList(data))
      .catch((err) => console.error(err));
  };

  const getMasterServices = async (masterCategoryId) => {
    if (!masterCategoryId) return;
    try {
      let url = `https://backendapi.trakky.in/salons/masterservice/?categories=${masterCategoryId}`;
      const requestOption = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(url, requestOption);
      if (response.status === 401) {
        toast.error("Session expired");
        logoutUser();
      } else if (response.status === 200) {
        const data = await response.json();
        setNextPage(data?.next);
        setMasterServiceData(data?.results || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMasterCategories = async (selectedgender) => {
    try {
      let url = "https://backendapi.trakky.in/salons/mastercategory/";
      if (selectedgender) url += `?gender=${selectedgender}`;
      const requestOption = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(url, requestOption);
      if (response.status === 200) {
        const data = await response.json();
        setMasterCategoryList(data);
      } else if (response.status === 401) {
        toast.error("Unauthorized access. Please log in again.", {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
      } else {
        toast.error(`Error : ${response.status} - ${response.statusText}`, {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
      }
    } catch (error) {
      toast.error("Failed to fetch categories. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
    }
  };

  /* ------------------- EFFECTS ------------------- */
  useEffect(() => {
    const loadCities = async () => {
      await getCity();
    };
    loadCities();
  }, []);

  useEffect(() => {
    const loadInitialCategories = async () => {
      if (serviceData) {
        await getCategories(selectSalonId, true);
      }
    };
    loadInitialCategories();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      if (selectSalonId.length > 0) {
        await getCategories(selectSalonId);
      }
    };
    loadCategories();
  }, [selectSalonId]);

  useEffect(() => {
    const loadMasterServices = async () => {
      const selectedCategory = categoryList.find(
        (item) => item.id === parseInt(categoryId)
      );
      if (selectedCategory)
        await getMasterServices(selectedCategory.master_category_id);
    };
    loadMasterServices();
  }, [categoryId, categoryList]);

  useEffect(() => {
    editorRef.current = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "bullet" }],
        ],
      },
    });
    if (serviceData?.description)
      editorRef.current.root.innerHTML = serviceData.description;

    const handleTextChange = () => {
      const content = editorRef.current.root.innerHTML;
      const cleaned = cleanContent(content);
      if (cleaned !== content) {
        editorRef.current.root.innerHTML = cleaned;
        const range = editorRef.current.getSelection();
        if (range) editorRef.current.setSelection(range.index, 0);
        else
          editorRef.current.setSelection(
            editorRef.current.getLength() - 1,
            0
          );
      }
    };
    editorRef.current.on("text-change", handleTextChange);

    return () => {
      if (editorRef.current) {
        editorRef.current.off("text-change", handleTextChange);
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let masterQuill = null;
    if (showMasterForm) {
      masterQuill = new Quill("#master-editor", {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "bullet" }],
          ],
        },
      });
      const handleMasterTextChange = () => {
        const content = masterQuill.root.innerHTML;
        const cleaned = cleanContent(content);
        if (cleaned !== content) {
          masterQuill.root.innerHTML = cleaned;
          const range = masterQuill.getSelection();
          if (range) masterQuill.setSelection(range.index, 0);
          else
            masterQuill.setSelection(
              masterQuill.getLength() - 1,
              0
            );
        }
      };
      masterQuill.on("text-change", handleMasterTextChange);
      masterEditorRef.current = masterQuill;
    }
    return () => {
      if (masterQuill) {
        masterQuill.off("text-change");
        masterQuill = null;
      }
      masterEditorRef.current = null;
    };
  }, [showMasterForm]);

  useEffect(() => {
    const loadMasterCategories = async () => {
      if (showMasterForm && masterGender) {
        await getMasterCategories(masterGender);
      }
    };
    loadMasterCategories();
  }, [showMasterForm, masterGender]);

  const fetchMoreServices = async () => {
    if (!nextPage) return;
    try {
      const response = await fetch(nextPage);
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setMasterServiceData((prev) => [...prev, ...data.results]);
      setNextPage(data?.next || null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadMore = async () => {
      if (nextPage) {
        await fetchMoreServices();
      }
    };
    loadMore();
  }, [nextPage]);

  useEffect(() => {
    if (masterServiceId && masterServiceData.length > 0) {
      const selectedService = masterServiceData.find(
        (svc) => svc.id === parseInt(masterServiceId)
      );
      if (selectedService) {
        setServiceTime({
          Total_days: selectedService.Total_days ?? null,
          Total_hours: selectedService.Total_hours ?? null,
          Total_minutes: selectedService.Total_minutes ?? null,
          Total_seating: selectedService.Total_seating ?? null,
        });
      }
    }
  }, [masterServiceId, masterServiceData]);

  /* ------------------- HANDLERS ------------------- */
  const handleSelectChange = (selectedOptions) => {
    setSelectedSalons(selectedOptions);
    setSelectSalonId(
      selectedOptions
        ? Array.isArray(selectedOptions)
          ? selectedOptions.map((opt) => opt.value)
          : [selectedOptions.value]
        : []
    );
  };

  const handleCategoryChange = (selected) => {
    setCategoryId(selected?.value || "");
    setMasterServiceId("");
    editorRef.current.root.innerHTML = "";
  };

  const handleServiceChange = (selected) => {
    setMasterServiceId(selected?.value || "");
    editorRef.current.root.innerHTML = selected?.description || "";
  };

  const cleanContent = (content) =>
    content
      .replace(/\s+/g, " ")
      .replace(/(?:\r\n|\r|\n)+/g, "<br>")
      .replace(/<p><\/p>/g, "")
      .replace(/<br\s*\/?>/g, "")
      .trim();

  /* ------------------- MAIN SERVICE SUBMIT ------------------- */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const description = editorRef.current.root.innerHTML;
    const cleanedDescription = cleanContent(description);

    const formData = new FormData();
    if (serviceData) {
      formData.append("salon", selectSalonId[0] || selectSalonId);
    } else {
      selectSalonId.forEach((id) => formData.append("salon_ids", id));
    }
    formData.append("description", cleanedDescription);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("categories", categoryId);
    formData.append("master_service", masterServiceId);

    // Add lengths in required format
    formData.append("lengths", JSON.stringify(addedLengths));

    const serviceTimePayload = {
      days: serviceTime?.Total_days || 0,
      hours: serviceTime?.Total_hours || 0,
      minutes: serviceTime?.Total_minutes || 0,
      seating: serviceTime?.Total_seating || 0,
    };
    formData.append("service_time", JSON.stringify(serviceTimePayload));

    const url = serviceData
      ? `https://backendapi.trakky.in/salons/service/${serviceData.id}/`
      : `https://backendapi.trakky.in/salons/service/`;
    const method = serviceData ? "PATCH" : "POST";

    try {
      let response = await fetch(url, {
        method,
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: formData,
      });

      if (response.status === 401) {
        toast.error("You're logged out");
        logoutUser();
        return;
      }

      if (!response.ok) {
        try {
          const errorData = await response.json();
          toast.error(errorData.error || errorData.detail || "Something went wrong.");
        } catch {
          toast.error(`Error: ${response.status}`);
        }
        return;
      }

      toast.success(
        serviceData
          ? "Service updated successful."
          : "Service added successful."
      );
      if (setServiceData) {
        setServiceData(serviceData);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error - Please check your connection'.");
    }
  };

  /* ------------------- MASTER SERVICE SUBMIT ------------------- */
  const handleMasterSubmit = async (event) => {
    event.preventDefault();
    if (!masterImg) {
      toast.error("Please upload a service image");
      return;
    }
    const formData = new FormData();
    formData.append("service_name", masterServiceName);
    formData.append(
      "description",
      cleanContent(masterEditorRef.current.root.innerHTML)
    );
    formData.append("gender", masterGender);
    formData.append("categories", masterCategoryId);
    formData.append("Total_days", masterServiceTime?.Total_days);
    formData.append("Total_hours", masterServiceTime?.Total_hours);
    formData.append("Total_minutes", masterServiceTime?.Total_minutes);
    formData.append("Total_seating", masterServiceTime?.Total_seating);
    formData.append("service_image", masterImg);

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/masterservice/",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: formData,
        }
      );
      if (response.status === 201) {
        const data = await response.json();
        toast.success("Master service added successfully");
        const selectedCat = categoryList.find(
          (c) => c.id === parseInt(categoryId)
        );
        if (
          selectedCat &&
          masterCategoryId == selectedCat.master_category_id
        ) {
          setMasterServiceData((prev) => [...prev, data]);
          setMasterServiceId(data.id);
          editorRef.current.root.innerHTML = data.description || "";
        }
        setMasterCategoryId("");
        setMasterGender("");
        setMasterServiceName("");
        setMasterImg(null);
        setMasterServiceTime({
          Total_days: null,
          Total_hours: null,
          Total_minutes: null,
          Total_seating: null,
        });
        masterEditorRef.current.root.innerHTML = "";
      } else if (response.status === 401) {
        toast.error("You're logged out");
        logoutUser();
      } else {
        toast.error(`Error: ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to add master service.");
    }
  };

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);
  const handleConfirmClose = () => {
    setShowMasterForm(false);
    setOpenConfirm(false);
  };
  const handleToggleMasterForm = () => {
    if (showMasterForm) handleOpenConfirm();
    else setShowMasterForm(true);
  };

  /* ------------------- MEMOIZED OPTIONS ------------------- */
  const categoryOptions = useMemo(
    () =>
      categoryList?.map((cat) => ({
        value: cat.id,
        label: `${cat.category_name} (${cat.category_gender}) - ${cat.city}`,
        master_category_id: cat.master_category_id,
      })),
    [categoryList]
  );

  const masterServiceOptions = useMemo(
    () =>
      masterServiceData.map((svc) => ({
        value: svc.id,
        label: `${svc.service_name} (${svc.gender})`,
        description: svc.description || "",
      })),
    [masterServiceData]
  );

  const selectedCategoryOption = useMemo(
    () =>
      categoryOptions.find((opt) => opt.value === parseInt(categoryId)) ||
      null,
    [categoryOptions, categoryId]
  );

  const selectedServiceOption = useMemo(
    () =>
      masterServiceOptions.find(
        (opt) => opt.value === parseInt(masterServiceId)
      ) || null,
    [masterServiceOptions, masterServiceId]
  );

  /* ------------------- RENDER ------------------- */
  return (
    <>
      <Toaster />
      <button
        type="button"
        onClick={handleToggleMasterForm}
        className="border p-2 border-slate-400 relative rounded-md mt-2 bg-blue-500 text-white mb-4"
        style={{ marginLeft: "auto", display: "block" }}
      >
        {showMasterForm ? "Close Master Service Form" : "Add Master Service"}
      </button>

      <div className="form-container">
        <div
          className={showMasterForm ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}
        >
          <form
            method="post"
            onSubmit={handleSubmit}
            className={showMasterForm ? "col-span-1" : ""}
          >
            <div className="row">
              <h3 className="form-title">
                {serviceData ? "Update" : "Add"} Service
              </h3>
            </div>

            {/* City */}
            <div className="row">
              <div className="input-box inp-id col-1 col-2">
                <label htmlFor="id">Select City</label>
                <select
                  disabled={serviceData !== undefined}
                  name="id"
                  id="id"
                  value={selectedCity}
                  onChange={(e) => {
                    setCategoryList([]);
                    setCategoryId("");
                    setMasterServiceId("");
                    editorRef.current.root.innerHTML = "";
                    setSelectedSalons(null);
                    setSelectedCity(e.target.value);
                  }}
                >
                  <option value="">Select City</option>
                  {city.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salon */}
            <div className="row">
              <div className="input-box inp-salon col-1 col-2 relative">
                <label htmlFor="salons">
                  Select Salon
                  <span className="Note_Inp_Classs">
                    Salon Must belongs to Selected city
                  </span>
                </label>
                <AsyncSelect
                  isDisabled={serviceData !== undefined}
                  isMulti={!serviceData}
                  cacheOptions
                  defaultOptions
                  loadOptions={loadSalons}
                  onChange={handleSelectChange}
                  value={selectedSalons}
                  placeholder="Search salons..."
                  noOptionsMessage={() => "Type to search salons"}
                />
              </div>
            </div>

            {/* Category */}
            <div className="row">
              <div className="input-box inp-time col-1">
                <label htmlFor="category">
                  Select Category
                  <span className="Note_Inp_Classs">
                    Make Sure Selected Category Present In Selected Salon
                  </span>
                </label>
                <div className="">
                  <Select
                    options={categoryOptions}
                    value={selectedCategoryOption}
                    onChange={handleCategoryChange}
                    placeholder="Search categories..."
                    isDisabled={!selectSalonId || selectSalonId.length === 0}
                    noOptionsMessage={() => "No categories available"}
                    styles={{ control: (base) => ({ ...base, flexGrow: 1 }) }}
                  />
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className={`border mt-3 p-1 border-slate-400 rounded-md ${
                      isRefreshing ? "bg-gray-400" : ""
                    }`}
                    disabled={selectSalonId.length === 0 || isRefreshing}
                  >
                    {isRefreshing ? (
                      <CircularProgress size={20} />
                    ) : (
                      <RefreshIcon />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Master Service */}
            <div className="row">
              <div className="input-box inp-time col-1 col-2">
                <label htmlFor="service">Select Service</label>
                <Select
                  options={masterServiceOptions}
                  value={selectedServiceOption}
                  onChange={handleServiceChange}
                  placeholder="Search services..."
                  isDisabled={!categoryId}
                  noOptionsMessage={() => "No services available"}
                />
              </div>
            </div>

            {/* Description */}
            <div className="row">
              <div className="input-box inp-name col-1 col-2">
                <label htmlFor="content">Description</label>
                <div
                  id="editor"
                  style={{ width: "100%", height: "100px" }}
                ></div>
              </div>
            </div>

            {/* Price & Discount */}
            <div className="row">
              <div className="input-box inp-price col-1 col-2">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Enter Price"
                  min={0}
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value < 0 ? 0 : e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.preventDefault()
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="input-box inp-discount col-1 col-2">
                <label htmlFor="discount">Discount Price</label>
                <input
                  type="number"
                  name="discount"
                  id="discount"
                  placeholder="Enter Discount"
                  value={discount}
                  min={0}
                  required
                  onChange={(e) =>
                    setDiscount(e.target.value < 0 ? 0 : e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.preventDefault()
                  }
                />
              </div>
            </div>

            {/* === NEW: Choose Length Section === */}
            <h4 className="text-lg font-semibold mb-3 ml-2">Choose Length (Optional)</h4>
            <div className="row">
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 border p-4 rounded-lg bg-gray-50">
                <div>
                  <label>Select Length Type</label>
                  <Select
                    options={lengthOptions}
                    value={lengthOptions.find(opt => opt.value === selectedLength) || null}
                    onChange={(opt) => setSelectedLength(opt?.value || "")}
                    placeholder="Choose length..."
                  />
                  {selectedLength === "Custom" && (
                    <input
                      type="text"
                      placeholder="Enter custom name (e.g. Extra Long)"
                      value={customLengthName}
                      onChange={(e) => setCustomLengthName(e.target.value)}
                      className="w-full mt-2 p-2 border rounded"
                    />
                  )}
                </div>

                <div>
                  <label>Price for this length</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={lengthPrice}
                    onChange={(e) => setLengthPrice(e.target.value)}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>

                <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <input
                    type="number"
                    placeholder="Hours"
                    value={lengthTiming.Total_hours}
                    onChange={(e) => setLengthTiming({...lengthTiming, Total_hours: e.target.value})}
                    className="p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Minutes"
                    value={lengthTiming.Total_minutes}
                    onChange={(e) => setLengthTiming({...lengthTiming, Total_minutes: e.target.value})}
                    className="p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Seating"
                    value={lengthTiming.Total_seating}
                    onChange={(e) => setLengthTiming({...lengthTiming, Total_seating: e.target.value})}
                    className="p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Days"
                    value={lengthTiming.Total_days}
                    onChange={(e) => setLengthTiming({...lengthTiming, Total_days: e.target.value})}
                    className="p-2 border rounded"
                  />
                </div>

                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={handleAddLength}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Add This Length
                  </button>
                </div>
              </div>

            
            </div>
              {/* Display Added Lengths */}
              {addedLengths.length > 0 && (
                <div className="mt-4 ml-2 mb-6">
                  <h5 className="font-medium">Added Lengths:</h5>
                  <div className="space-y-2 mt-2">
                    {addedLengths.map((len, idx) => {
                      const key = Object.keys(len)[0];
                      const data = len[key];
                      return (
                        <div key={idx} className="flex justify-between items-center bg-blue-50 p-3 rounded border">
                          <span><strong>{key}</strong> - ₹{data.price}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLength(key)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Old Service Time */}
            <div className="row col-2 !gap-4 !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4">
              <div className="input-box inp-time col-1">
                <label htmlFor="service-time" style={{ fontSize: "16px" }}>
                  Total Hours
                </label>
                <input
                  type="number"
                  value={serviceTime?.Total_hours || ""}
                  placeholder="Hours: 0, 1, 2..."
                  onChange={(e) =>
                    setServiceTime({
                      ...serviceTime,
                      Total_hours: e.target.value,
                    })
                  }
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.preventDefault()
                  }
                />
              </div>
              <div className="input-box inp-time col-1">
                <label htmlFor="service-time">Total Minutes</label>
                <input
                  type="number"
                  value={serviceTime?.Total_minutes || ""}
                  style={{ marginTop: "5px" }}
                  placeholder="Minutes: 0, 15, 30..."
                  onChange={(e) =>
                    setServiceTime({
                      ...serviceTime,
                      Total_minutes: e.target.value,
                    })
                  }
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.preventDefault()
                  }
                />
              </div>
              <div className="input-box inp-time col-1">
                <label htmlFor="service-time" style={{ fontSize: "16px" }}>
                  Total Seating
                </label>
                <input
                  type="number"
                  value={serviceTime?.Total_seating || ""}
                  placeholder="Seating: 0, 1, 2..."
                  onChange={(e) =>
                    setServiceTime({
                      ...serviceTime,
                      Total_seating: e.target.value,
                    })
                  }
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["ArrowUp", "ArrowDown"].includes(e.key) &&
                    e.preventDefault()
                  }
                />
              </div>
              <div className="input-box inp-time col-1">
                <label htmlFor="service-time">Total Days</label>
                <input
                  type="number"
                  value={serviceTime?.Total_days || ""}
                  style={{ marginTop: "5px" }}
                  placeholder="Days: 0, 1, 2..."
                  onChange={(e) =>
                    setServiceTime({
                      ...serviceTime,
                      Total_days: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="submit-btn row">
              <button type="submit">Submit</button>
            </div>
          </form>

          {/* Master Service Form (unchanged) */}
          {showMasterForm && (
            <div className="col-span-1">
              <form method="post" onSubmit={handleMasterSubmit}>
                <div className="row">
                  <h3 className="form-title">Add Master Services</h3>
                </div>
                <div className="row">
                  <div className="input-box inp-time col-1 col-2">
                    <label htmlFor="master-gender">Select Gender</label>
                    <select
                      name="gender"
                      id="master-gender"
                      required
                      value={masterGender || "not-select"}
                      onChange={(e) => {
                        setMasterCategoryId("");
                        setMasterGender(e.target.value);
                      }}
                    >
                      <option value="not-select" disabled hidden>
                        ---Select---
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="input-box inp-time col-1 col-2">
                    <label htmlFor="master-category">Select Category</label>
                    <select
                      name="category"
                      id="master-category"
                      required
                      value={masterCategoryId || "not-select"}
                      onChange={(e) => setMasterCategoryId(e.target.value)}
                    >
                      <option value="not-select" disabled hidden>
                        ---Select---
                      </option>
                      {masterCategoryList?.map((category, index) => (
                        <option value={category.id} key={index}>
                          {category.name} ({category.gender})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="input-box inp-service col-1 col-2">
                    <label htmlFor="master-service-name">Service Name</label>
                    <input
                      type="text"
                      name="service-name"
                      id="master-service-name"
                      placeholder="Enter Service Name"
                      required
                      value={masterServiceName}
                      onChange={(e) => setMasterServiceName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="input-box inp-name col-1 col-2">
                    <label htmlFor="master-content">Description</label>
                    <div
                      id="master-editor"
                      style={{ width: "100%", height: "100px" }}
                    ></div>
                  </div>
                </div>
                <div className="row">
                  <div className="input-box inp-main-img col-1 col-2">
                    <label>
                      Service Image{" "}
                      <span className="Note_Inp_Classs">
                        Recommended Image Ratio 1:1
                      </span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setMasterImg(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="submit-btn row">
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Close</DialogTitle>
        <DialogContent>
          Are you sure you want to close the Master Service Form?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmClose} color="error" autoFocus>
            Yes, Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddService;