import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DateRange from "./DateRange/DateRange";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import Switch from "@mui/material/Switch";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";
import AddSalon from "./Forms/SalonForm";
import AuthContext from "../Context/AuthContext";
import { formatDate } from "./DateRange/formatDate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import "./css/salonelist.css";

// multi select
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import GeneralModal from "./generalModal/GeneralModal";
import { useConfirm } from "material-ui-confirm";

import toast, { Toaster } from "react-hot-toast";

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
  const [expandedRow, setExpandedRow] = useState(null);
  const [isDropdown, setIsDropdown] = useState(null);
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

    abortControllerRef.current.abort();

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
      toast.error("Error occurred during search. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
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

  // const getSalonsDate = async () => {
  //   const [{ startDate, endDate }] = dateState;
  //   const formattedStartDate = formatDate(startDate);
  //   const formattedEndDate = formatDate(endDate);

  //   let url = `https://backendapi.trakky.in/salons/?start_date=${formattedStartDate}&page=${page}&end_date=${formattedEndDate}`;

  //   setLoading(true);

  //   try {
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const data = await response.json();
  //     setSalonsData(data.results);
  //     setTotalSalons(data.count);
  //     setDataDetails(
  //       `Entries between ${formattedStartDate} to ${formattedEndDate}`
  //     );
  //     if (scrollTopRef.current) {
  //       scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
  //     }
  //     if (data.next === null) {
  //       setHasMore(false);
  //     }
  //   } catch (error) {
  //     console.log("Error : ", error);
  //     toast.error("An error occured.", error, {
  //       duration: 4000,
  //       position: "top-center",
  //       style: {
  //         color: "#fff",
  //         backgroundColor: "#333",
  //       },
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const [modalSalonID, setModalSalonID] = useState(null);

  // multi select

  const [showIndividualPhotosModal, setShowIndividualPhotosModal] =
    useState(false);
  const [modalImageData, setModalImageData] = useState([]);

  const abortControllerRef = useRef(new AbortController());

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
    "Close/Open",
    "Facilities",
    "Salon type",
    "Offer Tag",
    "Price",
    "More",
    "Timings",
    "Verified",
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
      abortControllerRef.current.abort();

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
        toast.error("Error occurred during search. Please try again later", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
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
        abortControllerRef.current.abort();

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
          toast.error("Error occurred during search. Please try again later", {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
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

  // multi select
  const ITEM_HEIGHT = 40;
  const ITEM_PADDING_TOP = 5;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

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
      <div className="tb-body-content">
        <div className="tb-body-data" ref={scrollTopRef}>
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <Tooltip
                title={
                  showTodayData
                    ? "Disable date filter to select city"
                    : "Select city"
                }
              >
                <FormControl
                  sx={{
                    margin: "8px 2px",
                    minWidth: 110,
                    width: "fit-content",
                    maxWidth: 220,
                  }}
                  size="small"
                >
                  <InputLabel id="demo-multiple-checkbox-label">City</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    disabled={showTodayData}
                    value={selectedCityName}
                    onChange={handleCityFilter}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {cityName.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={selectedCityName.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Tooltip>
              <Tooltip
                title={
                  showTodayData
                    ? "Disable date filter to select area"
                    : "Select area"
                }
              >
                <FormControl sx={{ margin: "8px 2px", width: 110 }} size="small">
                  <InputLabel id="demo-multiple-checkbox-label">Area</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedAreaName}
                    onChange={handleAreaFilter}
                    disabled={showTodayData}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {availableAreaName?.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={selectedAreaName.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Tooltip>
              <Tooltip
                title={
                  showTodayData
                    ? "Disable date filter to select type"
                    : "Select type"
                }
              >
                <FormControl sx={{ margin: "8px 0", minWidth: 110 }} size="small">
                  <InputLabel id="demo-select-small-label">Type</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={filterField}
                    disabled={showTodayData}
                    label="Type"
                    onChange={(e) => setFilterField(e.target.value)}
                  >
                    <MenuItem value={"search"}>name</MenuItem>
                    {/* <MenuItem value={"priority"}>priority</MenuItem> */}
                    <MenuItem value={"mobile_number"}>mobilenumber</MenuItem>
                  </Select>
                </FormControl>
              </Tooltip>
              <Tooltip
                title={
                  showTodayData
                    ? "Disable date filter to search"
                    : "Search here"
                }
              >
                <div className="tb-body-search">
                  <div className="tb-search-field">
                    <input
                      type={
                        filterField === "mobilenumber" ||
                          filterField === "priority"
                          ? "number"
                          : "text"
                      }
                      name="search-inp"
                      placeholder="search here.."
                      disabled={showTodayData}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      onClick={
                        page === 1
                          ? handleSearch
                          : () => {
                            setPage(1);
                          }
                      }
                    >
                      Search
                    </button>
                  </div>
                </div>
              </Tooltip>
              <Tooltip
                title={
                  showTodayData
                    ? "Disable date filter to select category"
                    : "Select category"
                }
              >
                <div className="tb-src-input">
                  <FormControl
                    sx={{
                      margin: "8px 2px",
                      minWidth: 180,
                      width: "fit-content",
                    }}
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-label">
                      Select Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedSalonCategory}
                      disabled={showTodayData}
                      label="Select Category"
                      input={<OutlinedInput label="Select Category" />}
                      onChange={handleCategory}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {uniqueCategories.map((salon) => (
                        <MenuItem key={salon.id} value={salon.name}>
                          {salon.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Tooltip>
            </div>
            <div className="tb-add-item">
              <Link to="/addsalon">
                <button type="submit">
                  <AddIcon />
                  <div> Add Item</div>
                </button>
              </Link>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                margin: "auto 23px",
                fontSize: "0.9rem",
                fontStyle: "italic",
                backgroundColor: "white",
                borderRadius: "5px",
                boxShadow: "0px 3px 5px 0px #00000015",
                paddingRight: "10px",
              }}
            >
              <Switch
                checked={showTodayData}
                onChange={() => setShowTodayData(!showTodayData)}
                inputProps={{ "aria-label": "controlled" }}
              />
              {dataDetails}
            </div>
            <div
              className="DB-main-date-range "
              style={{ width: "fit-content", marginLeft: "auto" }}
            >
              <div
                className="DB-Date-Range-Button"
                onClick={() => {
                  setShowDateSelectionModal(true);
                }}
              >
                <input
                  type="text"
                  value={`${dateState[0].startDate.getDate()}-${dateState[0].startDate.getMonth() + 1
                    }-${dateState[0].startDate.getFullYear()}`}
                  style={{
                    width: "80px",
                    cursor: "auto",
                    border: "transparent",
                    paddingLeft: "5px",
                  }}
                  readOnly
                />
                <span style={{ paddingRight: "5px", paddingLeft: "5px" }}>
                  {" "}
                  ~{" "}
                </span>
                <input
                  type="text"
                  value={`${dateState[0]?.endDate?.getDate()}-${dateState[0]?.endDate?.getMonth() + 1
                    }-${dateState[0]?.endDate?.getFullYear()}`}
                  style={{
                    width: "80px",
                    cursor: "auto",
                    border: "transparent",
                  }}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={header === "Address" ? "address-field-s" : ""}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="not-found">
                    <td colSpan={17}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Loading
                      </div>
                    </td>
                  </tr>
                ) : salonsData?.length > 0 ? (
                  salonsData?.map(
                    (salon, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td>{salon.priority}</td>
                            <td>{salon.city}</td>
                            <td>{salon.area_priority}</td>
                            <td>{salon.area}</td>
                            <td>
                              {salon.secondary_areas_display?.map(area => area.name).join(", ") || "-"}
                            </td>
                            <td>{salon.name}</td>
                            <td>{salon.mobile_number}</td>
                            <td className="address-field-s">{salon.address}</td>
                            <td>{salon.landmark}</td>
                            <td>
                              <Switch
                                checked={salon.open}
                                onChange={() =>
                                  toggle(salon.id, "open", !salon.open)
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </td>
                            <td>{salon.facilities.join(", ") || "-"} </td>
                            <td>{salon.salon_type || "-"}</td>
                            <td>{salon.offer_tag || "-"}</td>
                            <td>{salon.price || "-"}</td>
                            <td>
                              {isDropdown !== index ? (
                                <IoIosArrowDropdown
                                  onClick={() => {
                                    setExpandedRow(index);
                                    setIsDropdown(index);
                                  }}
                                />
                              ) : (
                                <IoIosArrowDropup
                                  onClick={() => {
                                    setExpandedRow(null);
                                    setIsDropdown(null);
                                  }}
                                />
                              )}
                            </td>
                            <td>
                              <span
                                className="view-icon"
                                onClick={() => {
                                  setModalData(salon);
                                  setShowModal(true);
                                }}
                              >
                                <VisibilityIcon />
                              </span>
                            </td>
                            <td>
                              <Switch
                                checked={salon.verified}
                                onChange={() =>
                                  toggle(salon.id, "verified", !salon.verified)
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </td>
                            <td>
                              <Switch
                                checked={salon.premium}
                                onChange={() =>
                                  toggle(salon.id, "premium", !salon.premium)
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </td>
                            <td>
                              <Switch
                                checked={salon.top_rated}
                                onChange={() =>
                                  // toggle(
                                  //   salon.id,
                                  //   "top_rated",
                                  //   !salon.top_rated
                                  // )
                                  toggleAddAndRemove(
                                    salon.id,
                                    "top_rated",
                                    !salon.top_rated
                                  )
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </td>

                            <td>
                              <Switch
                                checked={salon.bridal}
                                // onChange={() =>
                                //   toggle(salon.id, "bridal", !salon.bridal)
                                // }
                                onChange={() =>
                                  toggleAddAndRemove(
                                    salon.id,
                                    "bridal",
                                    !salon.bridal
                                  )
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </td>

                            <td>
                              {
                                <Switch
                                  checked={salon.salon_academy}
                                  onChange={() =>
                                    // toggle(
                                    //   salon.id,
                                    //   "salon_academy",
                                    //   !salon.salon_academy
                                    // )
                                    toggleAddAndRemove(
                                      salon.id,
                                      "salon_academy",
                                      !salon.salon_academy
                                    )
                                  }
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              }
                            </td>
                            <td>
                              <Switch
                                checked={salon.makeup}
                                onChange={() =>
                                  // toggle(salon.id, "makeup", !salon.makeup)
                                  toggleAddAndRemove(
                                    salon.id,
                                    "makeup",
                                    !salon.makeup
                                  )
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </td>
                            <td>
                              <Switch
                                checked={salon?.female_beauty_parlour}
                                onChange={() =>
                                  // toggle(
                                  //   salon.id,
                                  //   "female_beauty_parlour",
                                  //   !salon?.female_beauty_parlour
                                  // )
                                  toggleAddAndRemove(
                                    salon.id,
                                    "female_beauty_parlour",
                                    !salon.female_beauty_parlour
                                  )
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </td>
                            <td>
                              <Switch
                                checked={salon?.kids_special_salons}
                                onChange={() =>
                                  // toggle(
                                  //   salon.id,
                                  //   "kids_special_salons",
                                  //   !salon?.kids_special_salons
                                  // )
                                  toggleAddAndRemove(
                                    salon.id,
                                    "kids_special_salons",
                                    !salon.kids_special_salons
                                  )
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </td>
                            <td>
                              <Switch
                                checked={salon?.male_salons}
                                onChange={() =>
                                  // toggle(
                                  //   salon.id,
                                  //   "male_salons",
                                  //   !salon?.male_salons
                                  // )
                                  toggleAddAndRemove(
                                    salon.id,
                                    "male_salons",
                                    !salon?.male_salons
                                  )
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </td>
                            <td>
                              <Switch
                                checked={salon?.unisex_salon}
                                onChange={() =>
                                  // toggle(
                                  //   salon.id,
                                  //   "unisex_salon",
                                  //   !salon?.unisex_salon
                                  // )
                                  toggleAddAndRemove(
                                    salon.id,
                                    "unisex_salon",
                                    !salon?.unisex_salon
                                  )
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </td>

                            <td>
                              <AiFillDelete
                                onClick={() => deleteSalon(salon.id)}
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                              &nbsp;&nbsp;
                              <FaEdit
                                onClick={() => setUpdateFormOpened(index)}
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            </td>
                          </tr>

                          {expandedRow === index ? (
                            <tr
                              className="more_salon_detail__container"
                              key={index}
                            >
                              <td>
                                <div className="image__container">
                                  <img
                                    src={salon.main_image}
                                    alt=""
                                    onClick={() => {
                                      setModalImageData(salon.main_image);
                                      setModalSalonID(salon.id);
                                      setShowIndividualPhotosModal(true);
                                    }}
                                  />

                                  {salon.mul_images.map((img, index) => {
                                    return (
                                      <img
                                        src={img.image}
                                        key={index}
                                        alt="img"
                                        onClick={() => {
                                          setShowIndividualPhotosModal(true);
                                          setModalImageData(img);
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          ) : null}
                          {updateFormOpened === index && (
                            <tr key={index}>
                              <td style={{ padding: 0 }}>
                                <Modal
                                  closeModal={() => setUpdateFormOpened(null)}
                                >
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
                      );
                    }
                    // )
                  )
                ) : (
                  <tr className="not-found">
                    <td colSpan={10}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        {showTodayData
                          ? "No entries found for today."
                          : "Please select a City and an Area before searching for Salons."}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing {salonsData.length} of {totalSalons} entries
          </div>
          <div className="tb-more-results">
            <div className="tb-pagination">
              <span id={parseInt(1)} onClick={handlePageChange}>
                ««
              </span>
              {page > 1 && (
                <span id={parseInt(page - 1)} onClick={handlePageChange}>
                  «
                </span>
              )}
              {page > 2 && (
                <span id={parseInt(page - 2)} onClick={handlePageChange}>
                  {page - 2}
                </span>
              )}
              {page > 1 && (
                <span id={parseInt(page - 1)} onClick={handlePageChange}>
                  {page - 1}
                </span>
              )}
              <span
                id={parseInt(page)}
                onClick={handlePageChange}
                className="active"
              >
                {page}
              </span>
              {page < totalPages && (
                <span id={parseInt(page + 1)} onClick={handlePageChange}>
                  {page + 1}
                </span>
              )}
              {page < totalPages - 1 && (
                <span id={parseInt(page + 2)} onClick={handlePageChange}>
                  {page + 2}
                </span>
              )}
              {page < totalPages && (
                <span id={parseInt(page + 1)} onClick={handlePageChange}>
                  »
                </span>
              )}
              <span id={parseInt(totalPages)} onClick={handlePageChange}>
                »»
              </span>
            </div>
          </div>
        </div>
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