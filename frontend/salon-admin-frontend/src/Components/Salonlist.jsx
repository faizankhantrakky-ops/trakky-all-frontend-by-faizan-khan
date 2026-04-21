import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import DateRange from "./DateRange/DateRange";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";
import AddSalon from "./Forms/SalonForm";
import AuthContext from "../Context/AuthContext";
import { formatDate } from "./DateRange/formatDate";
import { FiSearch, FiPlus, FiEye } from "react-icons/fi";
import GeneralModal from "./generalModal/GeneralModal";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";

const CustomSwitch = ({ checked, onChange, disabled = false }) => {
  return (
    <label
      className={`relative inline-flex items-center select-none
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      {/* Hidden Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
      />

      {/* Track */}
      <div
        className={`w-11 h-6 rounded-full transition-colors duration-300
        ${checked ? "bg-blue-600" : "bg-gray-300"}
        peer-focus:ring-2 peer-focus:ring-blue-400`}
      ></div>

      {/* Thumb */}
      <div
        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow
        transition-transform duration-300
        ${checked ? "translate-x-5" : "translate-x-0"}`}
      ></div>
    </label>
  );
};



const MultiSelect = ({ options, value, onChange, label, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayValue = value.length > 0 ? value.join(', ') : label;

  return (
    <div ref={ref} className="relative w-full sm:w-48">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full h-11 px-3 text-sm text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        title={disabled ? "Disable date filter to select" : "Select"}
      >
        {displayValue}
      </button>
      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((name) => (
            <label key={name} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={value.includes(name)}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...value, name]
                    : value.filter((v) => v !== name);
                  onChange({ target: { value: newValue } });
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const Salonlist = () => {
  const scrollTopRef = useRef(null);
  const confirm = useConfirm();
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [salonsData, setSalonsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("search");
  const [selectedCityName, setSelectedCityName] = useState([]);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [selectedAreaName, setSelectedAreaName] = useState([]);
  const [selectedSalonCategory, setSelectedSalonCategory] = useState("");
  const uniqueCategories = [
    { id: 1, name: "Bridal" },
    { id: 2, name: "Top Rated" },
    { id: 3, name: "Academy" },
    { id: 4, name: "Makeup" },
    { id: 5, name: "Female Beauty Parlour" },
    { id: 6, name: "Kids Special" },
    { id: 7, name: "Male" },
    { id: 8, name: "Unisex" },
  ];
  const [dataDetails, setDataDetails] = useState("");
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalSalons, setTotalSalons] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState([]);
  const [isDateSelected, setIsDateSelected] = useState(true);
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showTodayData, setShowTodayData] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [gallerySalon, setGallerySalon] = useState(null);
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
  useEffect(() => {
    if (selectedSalonCategory !== "") {
      getSalonsFromCategories(selectedSalonCategory);
    } else {
      handleSearch();
    }
  }, [page, dateState, showTodayData, selectedCityName, selectedAreaName, searchTerm, selectedSalonCategory]);
  useEffect(() => {
    let selectedAreas = getAreaNames(selectedCityName);
    if (selectedAreaName.length > 0) {
      setSelectedAreaName([]);
    }
    setAvailableAreaName(selectedAreas);
  }, [selectedCityName, cityPayloadData]);
  useEffect(() => {
    if (selectedCityName || selectedAreaName) {
      if (page === 1 && isDateSelected === false) {
        handleSearch();
      } else {
        if (selectedAreaName.length !== 0 || selectedCityName.length !== 0) {
          setTimeout(() => {
            if (page === 1) {
              handleSearch();
            } else {
              setPage(1);
            }
          }, 100);
        }
      }
    }
    setSelectedSalonCategory("");
  }, [selectedCityName, selectedAreaName]);
  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);
  useEffect(() => {
    getCity();
  }, []);
  const getSalonsFromCategories = async (category) => {
    let url = ``;
    let detailMessage = ``;
    if (category === "Bridal") {
      url = `https://backendapi.trakky.in/salons/filter/?bridal=true&page=${page}`;
      detailMessage += "Bridal, ";
    }
    if (category === "Top Rated") {
      url = `https://backendapi.trakky.in/salons/filter/?top_rated=true&page=${page}`;
      detailMessage += "Top Rated, ";
    }
    if (category === "Academy") {
      url = `https://backendapi.trakky.in/salons/filter/?academy_salons=true&page=${page}`;
      detailMessage += "Academy Salons, ";
    }
    if (category === "Makeup") {
      url = `https://backendapi.trakky.in/salons/filter/?makeup=true&page=${page}`;
      detailMessage += "Makeup, ";
    }
    if (category === "Female Beauty Parlour") {
      url = `https://backendapi.trakky.in/salons/filter/?female_beauty_parlour=true&page=${page}`;
      detailMessage += "Female Beauty Parlour, ";
    }
    if (category === "Kids Special") {
      url = `https://backendapi.trakky.in/salons/filter/?kids_special=true&page=${page}`;
      detailMessage += "Kids Special, ";
    }
    if (category === "Male") {
      url = `https://backendapi.trakky.in/salons/filter/?male_salons=true&page=${page}`;
      detailMessage += "Male Salons, ";
    }
    if (category === "Unisex") {
      url = `https://backendapi.trakky.in/salons/filter/?unisex_salon=true&page=${page}`;
      detailMessage += "Unisex Salons, ";
    }
    if (selectedAreaName.length > 0) {
      url = url + `&area=${selectedAreaName.join(",")}`;
      detailMessage += selectedAreaName.join(", ") + ", ";
    }
    if (selectedCityName.length > 0) {
      url = url + `&city=${selectedCityName.join(",")}`;
      detailMessage += selectedCityName.join(", ") + ", ";
    }
    if (searchTerm.length > 0) {
      url = url + `&${filterField}=${searchTerm}`;
      detailMessage += filterField + " " + searchTerm;
    }
    if (detailMessage.length === 0) {
      detailMessage += "all";
    }
    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort("Request canceled");
    }
    try {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });
      if (response.status === 200) {
        const data = await response.json();
        setSalonsData(data.results);
        setTotalSalons(data.count);
        setDataDetails(`Showing data for ${detailMessage}`);
        if (scrollTopRef.current) {
          scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
        if (data.next === null) {
          setHasMore(false);
        }
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error(
          `Error : ${response.status} - ${response.statusText}. Please try again later`
        );
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Search request aborted");
        return;
      }
      console.error("Error occurred during search:", error);
    
    } finally {
      setLoading(false);
    }
  };
  const handleCategory = async (event) => {
    if (event.target.value === "") {
      setSelectedSalonCategory(event.target.value);
      return;
    } else {
      setSelectedSalonCategory(event.target.value);
      getSalonsFromCategories(event.target.value);
    }
  };
  const [modalSalonID, setModalSalonID] = useState(null);
  const [showIndividualPhotosModal, setShowIndividualPhotosModal] =
    useState(false);
  const [modalImageData, setModalImageData] = useState([]);
  const abortControllerRef = useRef(null);
  const deleteSalon = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this salon?",
      });
      let response = await fetch(`https://backendapi.trakky.in/salons/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 204) {
        toast.success("Salon Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            color: "#fff",
            backgroundColor: "#333",
          },
        });
        handleSearch();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error("Something went wrong", {
          duration: 4000,
          position: "top-center",
          style: {
            color: "#fff",
            backgroundColor: "#333",
          },
        });
      }
    } catch (error) {
      if (error === undefined || error === "cancle") {
        return;
      }
      toast.error("Something went wrong", {
        duration: 4000,
        position: "top-center",
      });
    }
  };
  const toggle = async (id, formField, currentStatus) => {
    if (formField === "bridal" && currentStatus === true) {
      const formData = new FormData();
      formData.append("salon", id);
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/salon-bridal/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("Bridal added");
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        toast.error(`Error occured ${error}`);
      }
    }
    if (formField === "top_rated" && currentStatus === true) {
      const formData = new FormData();
      formData.append("salon", id);
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/salon-top-rated/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("Top Rated added");
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        toast.error(`Error occured ${error}`);
      }
    }
    if (formField === "academy_salons" && currentStatus === true) {
      const formData = new FormData();
      formData.append("salon", id);
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/salon-academy-salons/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("Academy Salons added");
        } else {
          toast.error("something went wrong");
        }
      } catch (error) {
        toast.error(`Error occured ${error}`);
      }
    }
    if (formField === "makeup" && currentStatus === true) {
      const formData = new FormData();
      formData.append("salon", id);
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/salon-makeup/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("Makeup added");
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        toast.error(`Error occured ${error}`);
      }
    }
    if (formField === "female_beauty_parlour" && currentStatus === true) {
      const formData = new FormData();
      formData.append("salon", id);
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salon-female-beauty-parlour/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("female beauty parlour added");
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        toast.error(`Error occured ${error}`);
      }
    }
    if (formField === "kids_special" && currentStatus === true) {
      const formData = new FormData();
      formData.append("salon", id);
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/salon-kids-special/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("kids special parlour added");
        } else {
          toast.error(`Something went wrong`);
        }
      } catch (error) {
        toast.error(`Error occured ${error}`);
      }
    }
    if (formField === "male_salons" && currentStatus === true) {
      const formData = new FormData();
      formData.append("salon", id);
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/salon-male/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("Male salon added");
        } else {
          toast.error(`Something went wrong`);
        }
      } catch (error) {
        toast.error(`Error occured ${error}`);
      }
    }
    if (formField === "unisex_salon" && currentStatus === true) {
      const formData = new FormData();
      formData.append("salon", id);
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/salon-unisex/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("Unisex salon added");
        } else {
          toast.error(`Something went wrong`);
        }
      } catch (error) {
        toast.error(`Error occured ${error}`);
      }
    }
    const formData = new FormData();
    const salon = salonsData.find((s) => s.id === id);
    formData.append(formField, currentStatus);
    for (var i = 0; i < salon.facilities.length; i++) {
      formData.append("facilities", salon.facilities[i]);
    }
    try {
      await fetch(`https://backendapi.trakky.in/salons/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: formData,
      }).then((result) => {
        result.json().then((resp) => {
          if (resp.detail === "Authentication credentials were not provided.") {
            alert("You'r logged out");
            logoutUser();
          } else {
            setSalonsData(
              salonsData.map((salon) =>
                salon.id === id
                  ? { ...salon, [formField]: currentStatus }
                  : salon
              )
            );
            toast.success("Salon Updated Successfully");
          }
        });
      });
    } catch (error) {
      alert("Error occured", error);
    }
  };
  const toggleAddAndRemove = async (id, formField, currentStatus) => {
    let url = `https://backendapi.trakky.in/salons/update-salon-categories/`;
    let payload = {
      salon: id,
      category: formField,
      verification: currentStatus,
    };
    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success("Updated Successfully");
        setSalonsData(
          salonsData.map((salon) =>
            salon.id === id ? { ...salon, [formField]: currentStatus } : salon
          )
        );
      } else {
        toast.error(`Something went wrong : ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Error occured ${error}`);
    }
  };
  const tableHeaders = [
    "City Priority",
    "City",
    "Area Priority",
    "Area",
    "Secondary Area",
    "Name",
    "Phone No.",
    "Address",
    "Landmark",
    
    // "Close/Open",
    "Active / Deactive",
    "Facilities",
    "Salon type",
    "Offer Tag",
    "Price",
    "Images",
    "Timings",
    "Verified",
    "Open For Online Booking",
    "Premium",
    "Top Rated",
    "Bridal",
    "Academy Salons",
    "Makeup",
    "female beauty parlour",
    "kids special",
    "male salons",
    "Unisex Salons",
    "Action",
  ];
  const handlePageChange = (e) => {
    const selectedPage = parseInt(e.target.id);
    setPage(selectedPage);
  };
  const handleSearch = async () => {
    let url = `https://backendapi.trakky.in/salons/?page=${page}`;
    let detailMessage = ``;
    if (showTodayData) {
      // When toggle is on, show today's data
      const today = new Date();
      const formattedToday = formatDate(today);
      url = url + `&start_date=${formattedToday}&end_date=${formattedToday}`;
      detailMessage = `Showing data for today (${formattedToday})`;
      // Always fetch data when toggle is on
      setLoading(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort("Request canceled");
      }
      try {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
          signal: abortController.signal,
        });
        if (response.status === 200) {
          const data = await response.json();
          setSalonsData(data.results);
          setTotalSalons(data.count);
          setDataDetails(detailMessage);
          if (scrollTopRef.current) {
            scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
          }
          if (data.next === null) {
            setHasMore(false);
          }
        } else if (response.status === 401) {
          logoutUser();
          toast.error("Unauthorized: Please log in again", {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } else {
          toast.error(
            `Error : ${response.status} - ${response.statusText}. Please try again later`
          );
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Search request aborted");
          return;
        }
        console.error("Error occurred during search:", error);
        
      } finally {
        setLoading(false);
      }
    } else {
      // When toggle is off, allow user to select filters
      if (selectedAreaName.length > 0) {
        url = url + `&area=${selectedAreaName.join(",")}`;
        detailMessage += selectedAreaName.join(", ") + ", ";
      }
      if (selectedCityName.length > 0) {
        url = url + `&city=${selectedCityName.join(",")}`;
        detailMessage += selectedCityName.join(", ") + ", ";
      }
      if (searchTerm.length > 0) {
        url = url + `&${filterField}=${searchTerm}`;
        detailMessage += filterField + " " + searchTerm;
      }
      if (selectedSalonCategory.length > 0) {
        url = url + `&category=${selectedSalonCategory}`;
        detailMessage += selectedSalonCategory + ", ";
      }
      if (detailMessage.length === 0) {
        detailMessage += "all";
      }
      // Only fetch data if at least one filter is selected when toggle is off
      if (selectedCityName.length > 0 || selectedAreaName.length > 0 || searchTerm.length > 0 || selectedSalonCategory.length > 0) {
        setLoading(true);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort("Request canceled");
        }
        try {
          const abortController = new AbortController();
          abortControllerRef.current = abortController;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + `${authTokens.access}`,
              "Content-Type": "application/json",
            },
            signal: abortController.signal,
          });
          if (response.status === 200) {
            const data = await response.json();
            setSalonsData(data.results);
            setTotalSalons(data.count);
            setDataDetails(detailMessage);
            if (scrollTopRef.current) {
              scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
            }
            if (data.next === null) {
              setHasMore(false);
            }
          } else if (response.status === 401) {
            logoutUser();
            toast.error("Unauthorized: Please log in again", {
              duration: 4000,
              position: "top-center",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          } else {
            toast.error(
              `Error : ${response.status} - ${response.statusText}. Please try again later`
            );
          }
        } catch (error) {
          if (error.name === "AbortError") {
            console.log("Search request aborted");
            return;
          }
          console.error("Error occurred during search:", error);
      
        } finally {
          setLoading(false);
        }
      } else {
        // If toggle is off and no filters are selected, clear the data and show the message
        setSalonsData([]);
        setTotalSalons(0);
        setDataDetails("Please select a City and an Area before searching for Salons.");
      }
    }
  };
  const salonsPerPage = 12;
  const totalPages = Math.ceil(totalSalons / salonsPerPage);
  const getCity = async () => {
    let url = `https://backendapi.trakky.in/salons/city/`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityPayloadData(data?.payload);
        let city = data?.payload.map((item) => item.name);
        setCityName(city);
      })
      .catch((err) => alert(err));
  };
  function getAreaNames(cityList) {
    if (!cityList.length) {
      return cityPayloadData?.flatMap((city) => city?.area_names);
    } else {
      let selectedAreas = [];
      for (let cityName of cityList) {
        cityName = cityName.toLowerCase();
        for (let city of cityPayloadData) {
          if (city?.name.toLowerCase() === cityName) {
            selectedAreas = selectedAreas?.concat(city.area_names);
            break;
          }
        }
      }
      return selectedAreas;
    }
  }
  const handleCityFilter = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCityName(typeof value === "string" ? value.split(",") : value);
  };
  const handleAreaFilter = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAreaName(typeof value === "string" ? value.split(",") : value);
  };


  const deleteMulImage = (data) => {
    try {
      fetch(
        `https://backendapi.trakky.in/salons/salon/${data?.salon}/mulimage/${data?.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      ).then((result) => {
        setShowIndividualPhotosModal(false);
        setModalImageData(null);
        handleSearch();
      });
    } catch (error) {
      alert("Error occured", error);
    }
  };

  
  const deleteMainImage = (id) => {
    try {
      fetch(`https://backendapi.trakky.in/salons/${id}/delete_main_image/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      }).then((result) => {
        setShowIndividualPhotosModal(false);
        setModalImageData(null);
        setModalSalonID(null);
        handleSearch();
      });
    } catch (error) {
      alert("Error occured", error);
    }
  };
  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    const suffix = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes} ${suffix}`;
  };
  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50 p-3 font-sans antialiased">
        <div ref={scrollTopRef} />
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Salons Management's
              </h2>
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
                  <MultiSelect
                    options={cityName}
                    value={selectedCityName}
                    onChange={handleCityFilter}
                    label="Select City"
                    disabled={showTodayData}
                  />
                  <MultiSelect
                    options={availableAreaName || []}
                    value={selectedAreaName}
                    onChange={handleAreaFilter}
                    label="Select Area"
                    disabled={showTodayData}
                  />
                  <div className="w-full sm:w-48">
                    <select
                      value={filterField}
                      onChange={(e) => setFilterField(e.target.value)}
                      disabled={showTodayData}
                      className={`w-full h-11 px-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${showTodayData ? 'cursor-not-allowed opacity-50' : ''}`}
                      title={showTodayData ? "Disable date filter to select type" : "Select type"}
                    >
                      <option value="search">name</option>
                      <option value="mobile_number">mobilenumber</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={filterField === "mobile_number" ? "number" : "text"}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={showTodayData}
                        placeholder="Search here..."
                        className={`w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 ${showTodayData ? 'cursor-not-allowed opacity-50' : ''}`}
                        title={showTodayData ? "Disable date filter to search" : "Search here"}
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={page === 1 ? handleSearch : () => setPage(1)}
                    className="h-11 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                  >
                    Search
                  </button>
                  <div className="w-full sm:w-48">
                    <select
                      value={selectedSalonCategory}
                      onChange={handleCategory}
                      disabled={showTodayData}
                      className={`w-full h-11 px-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${showTodayData ? 'cursor-not-allowed opacity-50' : ''}`}
                      title={showTodayData ? "Disable date filter to select category" : "Select category"}
                    >
                      <option value="">None</option>
                      {uniqueCategories.map((salon) => (
                        <option key={salon.id} value={salon.name}>
                          {salon.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Link to="/addsalon">
                  <button className="h-11 px-4 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center gap-2 transition">
                    <FiPlus className="h-5 w-5" />
                    Add Item
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6 border-b border-gray-200 flex items-center gap-4">
              <CustomSwitch
                checked={showTodayData}
                onChange={() => setShowTodayData(!showTodayData)}
              />
              <p className="text-sm text-gray-600 italic">{dataDetails}</p>
              <button
                onClick={() => setShowDateSelectionModal(true)}
                className="ml-auto h-11 px-4 text-sm bg-white border border-gray-300 rounded-md hover:border-blue-500 transition"
              >
                {`${dateState[0].startDate.getDate()}-${dateState[0].startDate.getMonth() + 1}-${dateState[0].startDate.getFullYear()}`} ~ {`${dateState[0].endDate.getDate()}-${dateState[0].endDate.getMonth() + 1}-${dateState[0].endDate.getFullYear()}`}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {tableHeaders.map((header, i) => (
                      <th
                        key={i}
                        className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={27} className="px-5 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                          <p className="text-sm font-medium">Loading salons...</p>
                        </div>
                      </td>
                    </tr>
                  ) : salonsData?.length > 0 ? (
                    salonsData?.map((salon, index) => (
                      <>
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.priority}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.city}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.area_priority}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.area}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">
                            {salon.secondary_areas_display?.map(area => area.name).join(", ") || "-"}
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.name}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.mobile_number}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.address}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.landmark}</td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                              checked={salon.open}
                              onChange={() => toggle(salon.id, "open", !salon.open)}
                            />
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.facilities.join(", ") || "-"} </td>
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.salon_type || "-"}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.offer_tag || "-"}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">{salon.price || "-"}</td>
                          <td className="px-5 py-3">
                            <IoIosArrowDropdown
                              className="cursor-pointer text-gray-600 hover:text-gray-800"
                              onClick={() => {
                                setGallerySalon(salon);
                                setShowGallery(true);
                              }}
                            />
                          </td>
                          <td className="px-5 py-3">
                            <FiEye
                              className="cursor-pointer text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                setModalData(salon);
                                setShowModal(true);
                              }}
                            />
                          </td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                              checked={salon.verified}
                              onChange={() => toggle(salon.id, "verified", !salon.verified)}
                            />
                          </td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                            />
                          </td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                              checked={salon.premium}
                              onChange={() => toggle(salon.id, "premium", !salon.premium)}
                            />
                          </td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                              checked={salon.top_rated}
                              onChange={() =>
                                toggleAddAndRemove(salon.id, "top_rated", !salon.top_rated)
                              }
                            />
                          </td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                              checked={salon.bridal}
                              onChange={() =>
                                toggleAddAndRemove(salon.id, "bridal", !salon.bridal)
                              }
                            />
                          </td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                              checked={salon.salon_academy}
                              onChange={() =>
                                toggleAddAndRemove(salon.id, "salon_academy", !salon.salon_academy)
                              }
                            />
                          </td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                              checked={salon.makeup}
                              onChange={() =>
                                toggleAddAndRemove(salon.id, "makeup", !salon.makeup)
                              }
                            />
                          </td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                              checked={salon?.female_beauty_parlour}
                              onChange={() =>
                                toggleAddAndRemove(
                                  salon.id,
                                  "female_beauty_parlour",
                                  !salon.female_beauty_parlour
                                )
                              }
                            />
                          </td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                              checked={salon?.kids_special_salons}
                              onChange={() =>
                                toggleAddAndRemove(
                                  salon.id,
                                  "kids_special_salons",
                                  !salon.kids_special_salons
                                )
                              }
                            />
                          </td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                              checked={salon?.male_salons}
                              onChange={() =>
                                toggleAddAndRemove(salon.id, "male_salons", !salon?.male_salons)
                              }
                            />
                          </td>
                          <td className="px-5 py-3">
                            <CustomSwitch
                              checked={salon?.unisex_salon}
                              onChange={() =>
                                toggleAddAndRemove(salon.id, "unisex_salon", !salon?.unisex_salon)
                              }
                            />
                          </td>
                          <td className="px-5 py-3 flex items-center gap-2">
                            <AiFillDelete
                              className="cursor-pointer text-red-600 hover:text-red-800"
                              onClick={() => deleteSalon(salon.id)}
                            />
                            <FaEdit
                              className="cursor-pointer text-blue-600 hover:text-blue-800"
                              onClick={() => setUpdateFormOpened(index)}
                            />
                          </td>
                        </tr>
                        {updateFormOpened === index && (
                          <tr>
                            <td colSpan={27} style={{ padding: 0 }}>
                              <Modal closeModal={() => setUpdateFormOpened(null)}>
                                <AddSalon
                                  salonData={salon}
                                  setsalonData={(data) => {
                                    setSalonsData(
                                      salonsData.map((salon) =>
                                        salon.id === data.id ? data : salon
                                      )
                                    );
                                  }}
                                  closeModal={() => setUpdateFormOpened(null)}
                                />
                              </Modal>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={27} className="px-5 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3"></div>
                          <p className="text-base font-medium">
                            {showTodayData
                              ? "No entries found for today."
                              : "Please select a City and an Area before searching for Salons."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                showing {salonsData.length} of {totalSalons} entries
              </p>
              <div className="flex gap-1">
                <button
                  id={1}
                  onClick={handlePageChange}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                  ««
                </button>
                {page > 1 && (
                  <button
                    id={page - 1}
                    onClick={handlePageChange}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    «
                  </button>
                )}
                {page > 2 && (
                  <button
                    id={page - 2}
                    onClick={handlePageChange}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    {page - 2}
                  </button>
                )}
                {page > 1 && (
                  <button
                    id={page - 1}
                    onClick={handlePageChange}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    {page - 1}
                  </button>
                )}
                <button
                  id={page}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md"
                >
                  {page}
                </button>
                {page < totalPages && (
                  <button
                    id={page + 1}
                    onClick={handlePageChange}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    {page + 1}
                  </button>
                )}
                {page < totalPages - 1 && (
                  <button
                    id={page + 2}
                    onClick={handlePageChange}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    {page + 2}
                  </button>
                )}
                {page < totalPages && (
                  <button
                    id={page + 1}
                    onClick={handlePageChange}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    »
                  </button>
                )}
                <button
                  id={totalPages}
                  onClick={handlePageChange}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                  »»
                </button>
              </div>
            </div>
          </div>
        </div>
        <GeneralModal
          open={showIndividualPhotosModal}
          handleClose={() => {
            setShowIndividualPhotosModal(false);
            setModalImageData(null);
          }}
        >
          <div>
            <h2 className="CWP-modal-spa-dht">
              {modalImageData?.image ? "salon Image" : "Salon Main Image"}
            </h2>
            <hr />
            {modalImageData?.image ? (
              <>
                <div
                  className="CWP-room-images"
                  style={{
                    maxWidth: "50vw",
                    margin: "10px auto",
                    padding: "10px",
                  }}
                >
                  <img src={modalImageData?.image} alt="img" />
                </div>
                <button
                  style={{
                    width: "150px",
                    display: "block",
                    margin: "20px auto",
                    color: "#ff0000",
                    backgroundColor: "#ff000020",
                    padding: "5px 15px",
                    borderRadius: "50px",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    deleteMulImage(modalImageData);
                  }}
                >
                  Delete Image
                </button>
              </>
            ) : (
              <>
                <div
                  className="CWP-room-images"
                  style={{
                    maxWidth: "50vw",
                    margin: "10px auto",
                    padding: "10px",
                  }}
                >
                  <img src={modalImageData} alt="img" />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "40px",
                  }}
                >
                  <button
                    style={{
                      width: "150px",
                      display: "block",
                      margin: "20px 0",
                      color: "#ff0000",
                      backgroundColor: "#ff000020",
                      padding: "5px 15px",
                      borderRadius: "50px",
                      fontWeight: "600",
                    }}
                    onClick={() => {
                      deleteMainImage(modalSalonID);
                    }}
                  >
                    Delete Image
                  </button>
                </div>
              </>
            )}
          </div>
        </GeneralModal>
       <GeneralModal
  open={showGallery}
  handleClose={() => setShowGallery(false)}
>
  <div>
    <h2 className="CWP-modal-spa-dht">Salon Images</h2>
    <hr />
    <div className="flex flex-wrap gap-4 justify-center p-4">
      {gallerySalon && (
        <>
          {/* ─── Main Image ──────────────────────────────────────── */}
          <div className="relative w-48 h-48">
            <img
              src={gallerySalon.main_image}
              alt="Main"
              className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80"
              onClick={() => {
                setModalImageData(gallerySalon.main_image);
                setModalSalonID(gallerySalon.id);
                setShowIndividualPhotosModal(true);
                setShowGallery(false);
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!window.confirm("Main image permanently delete karna hai?")) return;

                // You need a separate function for main image delete
                deleteMainImage({
                  salon: gallerySalon.id,
                  // assuming your backend expects similar structure
                });
              }}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-red-700 transition-colors z-10"
              title="Delete main image"
            >
              ×
            </button>
          </div>

          {/* ─── Multiple Images ─────────────────────────────────── */}
          {gallerySalon.mul_images.map((img, idx) => (
            <div key={img.id || idx} className="relative w-48 h-48">
              <img
                src={img.image}
                alt={`Image ${idx + 1}`}
                className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80"
                onClick={() => {
                  setShowIndividualPhotosModal(true);
                  setModalImageData(img);
                  setShowGallery(false);
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!window.confirm("Delete ?")) return;

                  deleteMulImage({
                    salon: gallerySalon.id,   // or gallerySalon.salon — check your data
                    id: img.id,               // very important — must have image id
                  });
                }}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-red-700 transition-colors z-10"
                title="Delete this image"
              >
                ×
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  </div>
</GeneralModal>
        <GeneralModal
          open={showDateSelectionModal}
          handleClose={() => setShowDateSelectionModal(false)}
        >
          <DateRange
            dateState={dateState}
            setDateState={setDateState}
            setShowDateSelectionModal={setShowDateSelectionModal}
          />
        </GeneralModal>
        {modalData !== null &&
          modalData !== undefined &&
          modalData.salon_timings !== null &&
          modalData.salon_timings !== undefined && (
            <GeneralModal
              open={showModal}
              handleClose={() => setShowModal(false)}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h2 className="CWP-modal-spa-dht">
                  {modalData.name} - Timings
                </h2>
                <div
                  className="CWP-modal-spa-details"
                  style={{ display: "flex", flexDirection: "row", gap: "2vw" }}
                >
                  <div style={{ marginLeft: "auto" }}>
                    <h2 className="CWP-modal-spa-dht">Days</h2>
                    <label style={{ fontSize: "0.95rem" }}>Monday</label>
                    <label style={{ fontSize: "0.95rem" }}>Tuesday</label>
                    <label style={{ fontSize: "0.95rem" }}>Wednesday</label>
                    <label style={{ fontSize: "0.95rem" }}>Thursday</label>
                    <label style={{ fontSize: "0.95rem" }}>Friday</label>
                    <label style={{ fontSize: "0.95rem" }}>Saturday</label>
                    <label style={{ fontSize: "0.95rem" }}>Sunday</label>
                  </div>
                  <div style={{ marginRight: "auto" }}>
                    <h2 className="CWP-modal-spa-dht">Open - Close Time</h2>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.salon_timings.monday === "object"
                        ? `${convertTo12HourFormat(
                          modalData.salon_timings.monday.open_time
                        )} - ${convertTo12HourFormat(
                          modalData.salon_timings.monday.close_time
                        )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.salon_timings.tuesday === "object"
                        ? `${convertTo12HourFormat(
                          modalData.salon_timings.tuesday.open_time
                        )} - ${convertTo12HourFormat(
                          modalData.salon_timings.tuesday.close_time
                        )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.salon_timings.wednesday === "object"
                        ? `${convertTo12HourFormat(
                          modalData.salon_timings.wednesday.open_time
                        )} - ${convertTo12HourFormat(
                          modalData.salon_timings.wednesday.close_time
                        )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.salon_timings.thursday === "object"
                        ? `${convertTo12HourFormat(
                          modalData.salon_timings.thursday.open_time
                        )} - ${convertTo12HourFormat(
                          modalData.salon_timings.thursday.close_time
                        )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.salon_timings.friday === "object"
                        ? `${convertTo12HourFormat(
                          modalData.salon_timings.friday.open_time
                        )} - ${convertTo12HourFormat(
                          modalData.salon_timings.friday.close_time
                        )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.salon_timings.saturday === "object"
                        ? `${convertTo12HourFormat(
                          modalData.salon_timings.saturday.open_time
                        )} - ${convertTo12HourFormat(
                          modalData.salon_timings.saturday.close_time
                        )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.salon_timings.sunday === "object"
                        ? `${convertTo12HourFormat(
                          modalData.salon_timings.sunday.open_time
                        )} - ${convertTo12HourFormat(
                          modalData.salon_timings.sunday.close_time
                        )}`
                        : "Closed"}
                    </label>
                  </div>
                </div>
              </div>
            </GeneralModal>
          )}
      </div>
    </>
  );
};
export default Salonlist;