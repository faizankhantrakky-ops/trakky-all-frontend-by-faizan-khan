import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import AsyncSelect from "react-select/async";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Switch from "@mui/material/Switch";
import { formatDate } from "./DateRange/formatDate";
import "./css/salonelist.css";
import { Link } from "react-router-dom";
import AddService from "./Forms/ServiceForm";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { IoMdInformationCircleOutline } from "react-icons/io";
import InfoIcon from "@mui/icons-material/Info";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";
import DateRange from "./DateRange/DateRange";
import GeneralModal from "./generalModal/GeneralModal";
// import Modal from "@mui/material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Modal error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '1px solid red', background: 'white', color: 'red', borderRadius: '8px' }}>
          <h2>Something went wrong in the edit modal.</h2>
          <details style={{ whiteSpace: 'pre-wrap', color: 'black' }}>
            {this.state.error && this.state.error.toString()}
          </details>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginRight: '10px', padding: '5px 10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Try again
          </button>
          <button 
            onClick={this.props.closeModal}
            style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Close Modal
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Services = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [servicesData, setservicesData] = useState([]);
  const [serviceDetails, setServiceDetails] = useState({});
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [city, setCity] = useState([]);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSalons, setSelectedSalons] = useState(null);
  const [selectedSalonId, setSelectSalonId] = useState("");
  const [hovered, setHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(true);
  const [priceRange, setPriceRange] = useState("");
  const priceRanges = [
    { label: "Under ₹500", value: "0-500" },
    { label: "₹500 - ₹1000", value: "500-1000" },
    { label: "Above ₹1000", value: "1000-0" },
  ];
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const location = useLocation();
  const dateState2 = location.state && location.state.dateState;
  const currentDate = new Date();
  let initialDateState;

  if (dateState2 === null) {
    initialDateState = [
      {
        startDate: currentDate,
        endDate: currentDate,
        key: "selection",
      },
    ];
  } else {
    initialDateState = [
      {
        startDate: dateState2[0].startDate,
        endDate: dateState2[0].endDate,
        key: "selection",
      },
    ];
  }

  const [dateState, setDateState] = useState(initialDateState);

  // Pagination
  const [page, setPage] = useState(1);
  const servicesPerPage = 30;
  const totalPages = Math.ceil(serviceDetails?.count / servicesPerPage);

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  const sortServicesByPriority = (data) => {
    if (!Array.isArray(data)) return [];

    return data?.sort((a, b) => {
      const categoryPriorityA =
        a.master_service_data?.category?.priority || Infinity;
      const categoryPriorityB =
        b.master_service_data?.category?.priority || Infinity;

      const priorityA = a.master_service_data?.priority || Infinity;
      const priorityB = b.master_service_data?.priority || Infinity;

      if (categoryPriorityA !== categoryPriorityB) {
        return categoryPriorityA - categoryPriorityB;
      }

      return priorityA - priorityB;
    });
  };

  // New state to track if we should fetch data
  const [shouldFetchData, setShouldFetchData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (dateFilter) {
        await getDatedServices();
      } else if (shouldFetchData) {
        await getServices(
          selectedAreaName,
          selectedCity,
          selectedSalonId,
          selectedCategory,
          page
        );
      }
    };
    loadData();
  }, [page, minPrice, maxPrice, shouldFetchData]); // Update dependencies

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 0 || searchTerm.length === 0) {
        setPage(1);
        const loadSearchData = async () => {
          if (dateFilter) {
            await getDatedServices();
          } else if (shouldFetchData) {
            await getServices(
              selectedAreaName,
              selectedCity,
              selectedSalonId,
              selectedCategory,
              1
            );
          }
        };
        loadSearchData();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, minPrice, maxPrice, shouldFetchData]);

  useEffect(() => {
    setservicesData([]);
    setServiceDetails({});
    setSelectedCity("");
    setSelectedAreaName("");
    setSelectedCategory("");
    setSelectedSalons(null);
    setSelectSalonId("");
    setPage(1);
    setMinPrice("");
    setMaxPrice("");
    setDateState(initialDateState);
    setShouldFetchData(false); // Reset fetch flag when toggling date filter
  }, [dateFilter]);

  const loadSalons = async (inputValue, callback) => {
    try {
      if (!selectedCity) {
        callback([]);
        return;
      }

      let url = `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
        inputValue
      )}&city=${selectedCity}`;

      if (selectedAreaName?.length > 0) {
        url += `&area=${selectedAreaName}`;
      }

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();

        const options = data?.results?.map((salon) => ({
          value: salon.id,
          label: salon.name,
        }));

        callback(options);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching salons:", error);
      callback([]);
    }
  };

  const getCity = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/city/`;

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        setCityPayload(data?.payload);
        let cityNames = data?.payload.map((item) => item.name);
        setCity(cityNames);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
      alert("Failed to fetch city data. Please try again later.");
    }
  };

  useEffect(() => {
    const loadCities = async () => {
      await getCity();
    };
    loadCities();
  }, []);

  useEffect(() => {
    if (!selectedSalons) {
      setservicesData([]);
      return;
    } else {
      // Only fetch if we have additional filters beyond city/area
      if (
        selectedSalonId ||
        selectedCategory ||
        searchTerm ||
        minPrice ||
        maxPrice
      ) {
        setShouldFetchData(true);
      }
    }
  }, [selectedSalons, selectedCategory]);

  useEffect(() => {
    setSelectedSalons(null);
    setSelectedCategory("");

    if (selectedCity || selectedAreaName) {
      // Don't fetch data immediately when just city/area is selected
      setShouldFetchData(false);
      setservicesData([]);
      setServiceDetails({});
    } else {
      setPage(1);
    }
  }, [selectedAreaName, selectedCity]);

  const getServices = async (
    selectedAreaName,
    selectedCity,
    salonId,
    selectedCategory,
    pageCount
  ) => {
    // Check if we have at least one filter beyond city/area
    if (
      !salonId &&
      !selectedCategory &&
      !searchTerm &&
      !minPrice &&
      !maxPrice
    ) {
      setservicesData([]);
      setServiceDetails({});
      return;
    }

    toast.loading("Fetching Services...", {
      duration: 4000,
      position: "top-center",
    });

    let url = `https://backendapi.trakky.in/salons/service/?page=${
      pageCount || page
    }`;

    if (selectedCity) {
      url += `&city=${selectedCity}`;
    }
    if (selectedAreaName) {
      url += `&area=${selectedAreaName}`;
    }
    if (searchTerm) {
      url += `&service_name=${encodeURIComponent(searchTerm)}`;
    }
    if (salonId) {
      url += `&salon_id=${salonId}`;
    }
    if (selectedCategory) {
      url += `&category_id=${selectedCategory}`;
    }

    try {
      const response = await fetch(url);
      toast.dismiss();

      if (response.status === 200) {
        const data = await response.json();
        let results = data || [];

        if (minPrice || maxPrice) {
          results = results.filter((service) => {
            const price = service.price;
            const min = minPrice ? Number(minPrice) : 0;
            const max = maxPrice ? Number(maxPrice) : Infinity;
            return price >= min && price <= max;
          });
        }

        const sortedData = sortServicesByPriority(results);
        setservicesData(sortedData);
        setServiceDetails({
          ...data,
          results: sortedData,
          count: sortedData.length,
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
        setservicesData([]);
        setServiceDetails({});
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error fetching services:", error);
      setservicesData([]);
      setServiceDetails({});
      return [];
    }
  };

  useEffect(() => {
    const loadDatedServices = async () => {
      await getDatedServices();
    };
    loadDatedServices();
  }, [dateState]);

  const getDatedServices = async () => {
    const [{ startDate, endDate }] = dateState;
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    toast.loading("Fetching Services...", {
      duration: 4000,
      position: "top-center",
    });

    let url = `https://backendapi.trakky.in/salons/service/?end_date=${formattedEndDate}&page=${page}&start_date=${formattedStartDate}`;

    if (searchTerm) {
      url += `&service_name=${encodeURIComponent(searchTerm)}`;
    }

    try {
      const response = await fetch(url);
      toast.dismiss();

      if (response.status === 200) {
        const data = await response.json();
        let results = data || [];

        if (minPrice || maxPrice) {
          results = results.filter((service) => {
            const price = service.price;
            const min = minPrice ? Number(minPrice) : 0;
            const max = maxPrice ? Number(maxPrice) : Infinity;
            return price >= min && price <= max;
          });
        }

        const sortedData = sortServicesByPriority(results);
        setservicesData(sortedData);
        setServiceDetails({
          ...data,
          results: sortedData,
          count: sortedData.length,
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
        setservicesData([]);
        setServiceDetails({});
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error fetching services:", error);
      setservicesData([]);
      setServiceDetails({});
      return [];
    }
  };

  function getAreaNames(cityList) {
    if (!cityList) {
      return cityPayload?.flatMap((city) => city?.area_names);
    } else {
      let selectedAreas = [];
      let cityName = selectedCity.toLowerCase();
      for (let city of cityPayload) {
        if (city?.name.toLowerCase() === cityName) {
          selectedAreas = selectedAreas?.concat(city.area_names);
          break;
        }
      }
      return selectedAreas;
    }
  }

  useEffect(() => {
    let selectedAreas = getAreaNames(selectedCity);
    setSelectedAreaName("");
    setAvailableAreaName(selectedAreas);
  }, [selectedCity, cityPayload]);

  const getCategories = async (selectedSalonId) => {
    const requestOption = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + `${authTokens.access}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/category/?salon_id=${selectedSalonId}`,
        requestOption
      );

      if (response.status === 200) {
        const data = await response.json();
        setCategoryList(data);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories. Please try again later.");
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      if (selectedSalonId !== "") {
        await getCategories(selectedSalonId);
      }
    };
    loadCategories();
  }, [selectedSalons, selectedSalonId]);

  const deleteServices = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this service?",
      });

      let response = await fetch(
        `https://backendapi.trakky.in/salons/service/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("Service Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            color: "#fff",
            backgroundColor: "#333",
          },
        });
        const refreshData = async () => {
          if (dateFilter) {
            await getDatedServices();
          } else {
            await getServices(
              selectedAreaName,
              selectedCity,
              selectedSalonId,
              selectedCategory,
              page
            );
          }
        };
        refreshData();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Something went wrong : ${response.status}`, {
          duration: 4000,
          position: "top-center",
          style: {
            color: "#fff",
            backgroundColor: "#333",
          },
        });
      }
    } catch (error) {
      if (error == undefined || error === "cancel") return;
      toast.error(`Something went wrong : ${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const handleDateFilterChange = () => {
    setDateFilter(!dateFilter);
  };

  const tableHeaders = [
    "Index",
    "category priority",
    "Master Service priority",
    "Service Name",
    "Service Image",
    "gender",
    "Category",
    "Salon Name",
    "Price",
    "Discount Price",
    "Time",
    "Description",
    "city",
    "Area",
    "Action",
  ];

  const downloadSampleCSV = () => {
    const csvContent = `salon_name,service_name,price,gender,hours,minutes,seating,days
Kalgi Salon and academy,Upperlips Threading,500,female,1,0,0,0
Kalgi Salon and academy,Blow dry,500,male,0,30,0,0
Kalgi Salon and academy,French nail art,150,female,0,30,0,0
Kalgi Salon and academy,Papaya and marshmallow facial,3500,male,0,90,0,0
Kalgi Salon and academy,Ginger and walnut facial,3500,male,0,90,0,0
Kalgi Salon and academy,Blanch,3900,male,0,90,0,0
Kalgi Salon and academy,Buttocks waxing,400,male,0,30,0,0
,,,,,,,
Femiluxe The Family Salon,Ammonia free hair colour,960,male,0,45,0,0
Femiluxe The Family Salon,Body polishing,6000,male ,2,0,0,0
Femiluxe The Family Salon,AVL Express Manicure & Pedicure,1199,male ,0,45,0,0
Femiluxe The Family Salon,Foot reflexology,800,male,0,30,0,0
Femiluxe The Family Salon,Groom packages,6000,male ,3,0,0,0
,,,,,,,
Hashtag salon,Beard Crafting,199,male ,0,30,0,0
Hashtag salon,No ammonia touch-up (2 inch),1199,female,0,60,0,0
Hashtag salon,No ammonia touch-up (4 inch),1599,female,0,60,0,0
Hashtag salon,Ammonia free hair colour,3499,female,2,0,0,0
Hashtag salon,Scalp scrub,249,female,0,30,0,0
Hashtag salon,Deep conditioning,749,male ,0,45,0,0
Hashtag salon,Deep conditioning,999,female,0,45,0,0
Hashtag salon,Dandruff treatment,699,male ,0,45,0,0
Hashtag salon,Dandruff treatment,999,female,0,45,0,0
Hashtag salon,Gypsy mavi,2499,male ,0,60,0,0
Hashtag salon,Gypsy mavi,3499,female,0,60,0,0
Hashtag salon,Scalp treatment,1199,female,0,60,0,0
Hashtag salon,Scalp treatment,1199,male ,0,60,0,0
Hashtag salon,MOROCCAN Hair spa,3499,female,0,60,0,0
Hashtag salon,Moroccan Hair Spa,2999,male ,0,60,0,0
Hashtag salon,Rica Waxing (Under Arms),149,female,0,30,0,0
,,,,,,,
Habib's hair & beauty salon,Ironing/crimping/tongs (upto shoulder),450,female,0,30,0,0
Habib's hair & beauty salon,Ironing/crimping/tongs (up to below shoulder),550,female,0,30,0,0
Habib's hair & beauty salon,Ironing/crimping/tongs (up to upto waist),650,female,0,30,0,0
Habib's hair & beauty salon,Global colour (up to shoulder),3500,female,1,30,0,0
Habib's hair & beauty salon,Crown highlights,3000,female,0,90,0,0
Habib's hair & beauty salon,Shampoo wash,250,female,0,30,0,0
Habib's hair & beauty salon,Shampoo wash,120,male,0,30,0,0
Habib's hair & beauty salon,Conditioner,250,female,0,30,0,0
Habib's hair & beauty salon,Conditioner,120,male,0,30,0,0
Habib's hair & beauty salon,Hair wash (keratin/morrocan),150,male,0,30,0,0
Habib's hair & beauty salon,Hair wash (keratin/morrocan),300,female,0,30,0,0
Habib's hair & beauty salon,Beard spa,500,male ,0,30,0,0
Habib's hair & beauty salon,Global hair colour,1500,male,0,45,0,0
Habib's hair & beauty salon,Rebounding for women (up to waist),10000,female,3,0,0,0
Habib's hair & beauty salon,Blow dry in curl /out curl/straight  (up to waist),7800,female,2,0,0,0
Habib's hair & beauty salon,Half front d-tan,300,female,0,30,0,0
Habib's hair & beauty salon,Dtan half leg,350,female,0,30,0,0
Habib's hair & beauty salon,Dtan hands,250,female,0,30,0,0
Habib's hair & beauty salon,Face & neck d-tan,350,female,0,30,0,0
Habib's hair & beauty salon,Bleach full hands,400,female,0,45,0,0
Habib's hair & beauty salon,Bleach full legs,600,female,0,45,0,0
Habib's hair & beauty salon,Bleach half leg,350,female,0,30,0,0
Habib's hair & beauty salon,Bleach full front,550,female,0,45,0,0
Habib's hair & beauty salon,Bleach under arms,150,female,0,20,0,0
Habib's hair & beauty salon,Back bleach,550,female,0,20,0,0
Habib's hair & beauty salon,Bleach full body,2000,female,0,60,0,0
Habib's hair & beauty salon,Half hand bleach,250,female,0,30,0,0
Habib's hair & beauty salon,Full face bleach,400,female,0,45,0,0
Habib's hair & beauty salon,Groom makeup,2500,male ,0,90,0,0`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "services_upload_sample.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Sample CSV downloaded successfully!", {
      duration: 4000,
      position: "top-center",
    });
  };

  // Function to check if we have additional filters beyond city/area
  const hasAdditionalFilters = () => {
    return (
      selectedSalonId || selectedCategory || searchTerm || minPrice || maxPrice
    );
  };

  // Function to handle applying filters
  const handleApplyFilters = () => {
    if (hasAdditionalFilters()) {
      setShouldFetchData(true);
      setPage(1);
    } else {
      toast.error(
        "Please select at least one additional filter (salon, category, search term, or price range)"
      );
    }
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        {hovered && dateFilter && (
          <div className="custom-dialog-box">
            <InfoIcon style={{ margin: "auto", height: "18px" }} />
            <p>Disable Date Filter to Select City.</p>
          </div>
        )}
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div
              className="tb-body-src-fil"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {/* City Filter */}
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "150px", flex: "1 0 auto" }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <FormControl
                  sx={{ margin: "8px 0", width: "100%" }}
                  size="small"
                >
                  <InputLabel id="city-select-label">City</InputLabel>
                  <Select
                    disabled={dateFilter}
                    labelId="city-select-label"
                    id="city-select"
                    value={selectedCity}
                    label="City"
                    onChange={(e) => {
                      setSelectedSalons(null);
                      setSelectedCity(e.target.value);
                      setShouldFetchData(false);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {city?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Area Filter */}
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "150px", flex: "1 0 auto" }}
              >
                <FormControl
                  sx={{ margin: "8px 0", width: "100%" }}
                  size="small"
                  disabled={!selectedCity}
                >
                  <InputLabel id="area-select-label">Area</InputLabel>
                  <Select
                    labelId="area-select-label"
                    id="area-select"
                    value={selectedAreaName}
                    label="Area"
                    onChange={(e) => {
                      setSelectedAreaName(e.target.value);
                      setShouldFetchData(false);
                    }}
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {availableAreaName?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Service Search */}
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "200px", flex: "2 0 auto" }}
              >
                <input
                  type="text"
                  placeholder="Search service name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "100%",
                  }}
                />
              </div>

              {/* Price Range */}
              <div
                className="tb-body-filter"
                style={{
                  padding: 0,
                  minWidth: "250px",
                  flex: "2 0 auto",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <FormControl
                  sx={{ margin: "8px 0", flex: "1" }}
                  size="small"
                  disabled={!selectedCity}
                >
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      width: "100%",
                    }}
                    min="0"
                  />
                </FormControl>
                <FormControl
                  sx={{ margin: "8px 0", flex: "1" }}
                  size="small"
                  disabled={!selectedCity}
                >
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      width: "100%",
                    }}
                    min="0"
                  />
                </FormControl>
              </div>

              {/* Salon Search */}
              <div
                className="input-box inp-salon"
                style={{ minWidth: "250px", flex: "2 0 auto", zIndex: 10 }}
              >
                <AsyncSelect
                  defaultOptions
                  loadOptions={loadSalons}
                  value={selectedSalons}
                  onChange={(selectedSalon) => {
                    setSelectedSalons(selectedSalon);
                    setSelectSalonId(selectedSalon ? selectedSalon.value : "");
                  }}
                  noOptionsMessage={() => "No salons found"}
                  // isDisabled={selectedAreaName === ""}
                  placeholder="Search Salon..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#ccc",
                      boxShadow: "none",
                      minHeight: "40px",
                      "&:hover": {
                        borderColor: "#ccc",
                      },
                    }),
                  }}
                />
              </div>

              {/* Category Filter */}
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "150px", flex: "1 0 auto" }}
              >
                <FormControl
                  sx={{ margin: "8px 0", width: "100%" }}
                  size="small"
                  disabled={!selectedSalons}
                >
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                    }}
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {categoryList?.map((category, index) => (
                      <MenuItem value={category.id} key={index}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Apply Filters Button
              {!dateFilter && (
                <div className="tb-body-filter" style={{ padding: 0, minWidth: "150px", flex: "1 0 auto" }}>
                  <button
                    onClick={handleApplyFilters}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      height: "40px",
                    }}
                    disabled={!selectedCity || !selectedAreaName}
                  >
                    Apply Filters
                  </button>
                </div>
              )} */}
            </div>

            {/* Action Buttons */}
            <div
              className="tb-add-item"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <Link to="/addservice">
                <button
                  type="submit"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <AddIcon />
                  <span> Add Item</span>
                </button>
              </Link>
              <button
                type="submit"
                onClick={() => setImportModalOpen(true)}
                style={{ display: "flex", alignItems: "center" }}
              >
                <AddIcon />
                <span> Import CSV</span>
              </button>
              <button
                type="button"
                onClick={downloadSampleCSV}
                style={{ display: "flex", alignItems: "center" }}
              >
                <span> Sample CSV</span>
              </button>
            </div>
          </div>
          <div className="Note_Inp_Classs">
            You must select first city then salon after you search service name
          </div>
          <div className="Note_Inp_Classs">
            You must select first city then area and after that you select salon
            and search service name
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p style={{ paddingLeft: "20px" }}>
              Date Filter :
              <Switch
                checked={dateFilter}
                inputProps={{ "aria-label": "controlled" }}
                onClick={handleDateFilterChange}
              />{" "}
            </p>
            {dateFilter ? (
              <div
                className="custom-main-date-range "
                style={{ width: "fit-content", marginLeft: "10px" }}
              >
                <div
                  className="custom-Date-Range-Button"
                  onClick={() => {
                    setShowDateSelectionModal(true);
                  }}
                >
                  <input
                    type="text"
                    value={`${dateState[0].startDate.getDate()}-${
                      dateState[0].startDate.getMonth() + 1
                    }-${dateState[0].startDate.getFullYear()}`}
                    style={{
                      width: "80px",
                      cursor: "auto",
                      border: "transparent",
                      paddingLeft: "10px",
                    }}
                    readOnly
                    disabled={!dateFilter}
                  />
                  <span style={{ paddingRight: "5px" }}> ~ </span>
                  <input
                    type="text"
                    value={`${dateState[0]?.endDate?.getDate()}-${
                      dateState[0]?.endDate?.getMonth() + 1
                    }-${dateState[0]?.endDate?.getFullYear()}`}
                    style={{
                      width: "80px",
                      cursor: "auto",
                      border: "transparent",
                    }}
                    readOnly
                    disabled={!dateFilter}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    style={
                      header === "Description"
                        ? { maxWidth: "356px", minWidth: "356px" }
                        : {}
                    }
                  >
                    {header}
                  </th>
                ))}
              </thead>
              <tbody>
                {dateFilter ? (
                  servicesData.length === 0 ? (
                    <tr className="not-found">
                      <td colSpan={10}>
                        <div
                          style={{
                            maxWidth: "82vw",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                          }}
                        >
                          No entries for selected date.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    servicesData?.map((service, index) => (
                      <tr key={index}>
                        <td>{Math.floor((page - 1) * 30 + index + 1)}</td>
                        <td>
                          {service.master_service_data?.category.priority}
                        </td>
                        <td>{service.master_service_data?.priority}</td>
                        <td>{service.service_name}</td>
                        <td>
                          {service?.service_image ? (
                            <img
                              src={service.service_image}
                              alt="category"
                              style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "5px",
                                objectFit: "contain",
                                margin: "0 auto",
                              }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>{service.gender || "-"}</td>
                        <td>
                          {service.master_service_data?.category?.name || "-"}
                        </td>
                        <td>{service.salon_name}</td>
                        <td>{service.price}</td>
                        <td>{service.discount}</td>
                        <td
                          style={{
                            textAlign: "left",
                          }}
                        >
                          hours : {service.service_time.hours} <br />
                          minutes : {service.service_time.minutes} <br />
                          Seating : {service.service_time.seating} <br />
                          days : {service.service_time.days} <br />
                        </td>
                        <td className="description-td-quill">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: service.description,
                            }}
                          />
                        </td>
                        <td>{service.city || "-"}</td>
                        <td>{service.area || "-"}</td>

                        <td>
                          <AiFillDelete
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteServices(service.id)}
                          />
                          &nbsp;&nbsp;
                          <FaEdit
                            onClick={() => setEditingService(service)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                      </tr>
                    ))
                  )
                ) : selectedCity?.length === 0 &&
                  selectedAreaName?.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={10}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Please select a city and area to view services.
                      </div>
                    </td>
                  </tr>
                ) : servicesData.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={10}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        {hasAdditionalFilters()
                          ? "No services found for the selected filters."
                          : "Please select at least one additional filter (salon, category, search term, or price range)"}
                      </div>
                    </td>
                  </tr>
                ) : (
                  servicesData?.map((service, index) => (
                    <tr key={index}>
                      <td>{Math.floor((page - 1) * 30 + index + 1)}</td>
                      <td>
                        {service.master_service_data?.category.priority}
                      </td>
                      <td>{service.master_service_data?.priority}</td>
                      <td>{service.service_name}</td>
                      <td>
                        {service?.service_image ? (
                          <img
                            src={service.service_image}
                            alt="category"
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "5px",
                              objectFit: "contain",
                              margin: "0 auto",
                            }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td>{service.gender || "-"}</td>
                      <td>
                        {service.master_service_data?.category?.name || "-"}
                      </td>
                      <td>{service.salon_name}</td>
                      <td>{service.price}</td>
                      <td>{service.discount}</td>
                      <td
                        style={{
                          textAlign: "left",
                        }}
                      >
                        hours : {service.service_time.hours} <br />
                        minutes : {service.service_time.minutes} <br />
                        Seating : {service.service_time.seating} <br />
                        days : {service.service_time.days} <br />
                      </td>
                      <td className="description-td-quill">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: service.description,
                          }}
                        />
                      </td>
                      <td>{service.city || "-"}</td>
                      <td>{service.area || "-"}</td>

                      <td>
                        <AiFillDelete
                          style={{ cursor: "pointer" }}
                          onClick={() => deleteServices(service.id)}
                        />
                        &nbsp;&nbsp;
                        <FaEdit
                          onClick={() => setEditingService(service)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {serviceDetails?.count > servicesPerPage && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    id={number}
                    onClick={handlePageChange}
                    className={page === number ? "active" : ""}
                  >
                    {number}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal - Rendered at root level, wrapped in ErrorBoundary */}
      {editingService && (
        <ErrorBoundary closeModal={() => setEditingService(null)}>
          <Modal closeModal={() => setEditingService(null)}>
            <AddService
              serviceData={editingService}
              setServiceData={(data) => {
                setservicesData((prevServices) =>
                  prevServices.map((prevService) =>
                    prevService.id === data.id
                      ? data
                      : prevService
                  )
                );
                setEditingService(null);
              }}
            />
          </Modal>
        </ErrorBoundary>
      )}

      {/* Date Range Modal */}
      {showDateSelectionModal && (
        <GeneralModal
          closeModal={() => setShowDateSelectionModal(false)}
          title="Select Date Range"
        >
          <DateRange
            dateState={dateState}
            setDateState={setDateState}
            closeModal={() => setShowDateSelectionModal(false)}
          />
        </GeneralModal>
      )}

      {/* Import CSV Modal */}
      {importModalOpen && (
        <Modal
          closeModal={() => setImportModalOpen(false)}
          title="Import Services from CSV"
        >
          <div
            style={{
              padding: "20px",
              background: "white",
              borderRadius: "15px",
            }}
          >
            <div className="text-gray-600 font-bold text-lg p-2 mb-2">
              Upload CSV
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ marginBottom: "20px" }}
            />
            <button
              onClick={async () => {
                if (!selectedFile) {
                  toast.error("Please select a file first");
                  return;
                }

                const formData = new FormData();
                formData.append("file", selectedFile);

                try {
                  const response = await fetch(
                    "https://backendapi.trakky.in/salons/upload-services/",
                    {
                      method: "POST",
                      headers: {
                        Authorization: "Bearer " + `${authTokens.access}`,
                      },
                      body: formData,
                    }
                  );

                  if (response.ok) {
                    toast.success("Services imported successfully!");
                    setImportModalOpen(false);
                    const refreshImportData = async () => {
                      if (dateFilter) {
                        await getDatedServices();
                      } else {
                        await getServices(
                          selectedAreaName,
                          selectedCity,
                          selectedSalonId,
                          selectedCategory,
                          page
                        );
                      }
                    };
                    refreshImportData();
                  } else {
                    const errorData = await response.json();
                    toast.error(
                      errorData.message || "Failed to import services"
                    );
                  }
                } catch (error) {
                  console.error("Error importing services:", error);
                  toast.error("An error occurred while importing services");
                }
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Import
            </button>
            <button
              onClick={() => setImportModalOpen(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Services;