import React, { useState, useContext, useEffect, useRef } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const formatExpireDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = date.getDate();
  let daySuffix;

  if (day > 3 && day < 21) daySuffix = "th";
  else {
    switch (day % 10) {
      case 1:
        daySuffix = "st";
        break;
      case 2:
        daySuffix = "nd";
        break;
      case 3:
        daySuffix = "rd";
        break;
      default:
        daySuffix = "th";
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${day}${daySuffix} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;
};

const AddSalonProfileOfferWithTheme = (profileOffers) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [themes, setThemes] = useState([]);
  const [masterCategories, setMasterCategories] = useState([]);
  const [themeName, setThemeName] = useState("");
  const [selectedMasterCategory, setSelectedMasterCategory] = useState(null);
  const [isAddingTheme, setIsAddingTheme] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [selectedCity, setSelectedCity] = useState(
    profileOffers?.profileOffers?.salon_city || ""
  );
  const [offerTime, setOfferTime] = useState(
    profileOffers?.profileOffers?.offer_time || {
      days: null,
      hours: null,
      minutes: null,
      seating: null,
    }
  );
  const [city, setCity] = useState([]);
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (profileOffers?.profileOffers) {
      const salon = profileOffers.profileOffers;
      return [
        {
          value: salon.salon,
          label: salon.salon_name,
        },
      ];
    } else {
      return [];
    }
  });

  const [offerName, setOfferName] = useState(
    profileOffers?.profileOffers?.name || ""
  );
  const [actualPrice, setActualPrice] = useState(
    profileOffers?.profileOffers?.actual_price || ""
  );
  const [discountedPrice, setDiscountedPrice] = useState(
    profileOffers?.profileOffers?.discount_price || ""
  );
  const [gender, setGender] = useState(
    profileOffers?.profileOffers?.gender || ""
  );
  const [img, setImg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [startDate, setStartDate] = useState(
    profileOffers?.profileOffers?.starting_date || ""
  );
  const [endDate, setEndDate] = useState(
    profileOffers?.profileOffers?.expire_date || ""
  );
  const editorRef = useRef(null);
  const [initialContentSet, setInitialContentSet] = useState(false);

  // States for Theme Section
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [themeImages, setThemeImages] = useState([
    "https://placehold.co/800x450/E9D5FF/5B21B6?text=Theme+1",
    "https://placehold.co/800x450/D1D5DB/1F2937?text=Theme+2",
    "https://placehold.co/800x450/BFDBFE/1D4ED8?text=Theme+3",
    "https://placehold.co/800x450/B6F7D8/065F46?text=Theme+4",
    "https://placehold.co/800x450/FDE047/78350F?text=Theme+5",
  ]);
  const [newThemeImage, setNewThemeImage] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salons/offer-themes/"
        );
        if (!response.ok) throw new Error("Failed to fetch themes");
        const data = await response.json();

        // Enhance themes with master category names for filtering
        const enhancedThemes = data.map((theme) => {
          const masterCat = masterCategories.find(
            (cat) => cat.id === theme.master_category
          );
          return {
            ...theme,
            master_category_name: masterCat ? masterCat.name : "",
          };
        });

        setThemes(enhancedThemes || []);
      } catch (error) {
        console.error("Failed to fetch themes:", error);
      }
    };

    const fetchMasterCategories = async () => {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salons/mastercategory/"
        );
        if (!response.ok) throw new Error("Failed to fetch master categories");
        const data = await response.json();
        setMasterCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch master categories:", error);
      }
    };

    fetchThemes();
    fetchMasterCategories();
    //   fetchCategories();
    getCity();
  }, []);

  // Load master categories for async select
  const loadMasterCategories = async (inputValue, callback) => {
    const filtered = masterCategories
      .filter((cat) =>
        cat.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((cat) => ({
        value: cat.id,
        label: `${cat.name} (${cat.gender})`, // showing gender with name
      }));
    callback(filtered);
  };

  // Handle theme deletion
  const handleDeleteTheme = async (themeId) => {
    if (!window.confirm("Are you sure you want to delete this theme?")) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/offer-themes/${themeId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
          },
        }
      );

      if (response.ok) {
        setThemes((prev) => prev.filter((theme) => theme.id !== themeId));
        toast.success("Theme deleted successfully");
      } else {
        throw new Error("Failed to delete theme");
      }
    } catch (error) {
      console.error("Error deleting theme:", error);
      toast.error("Failed to delete theme");
    }
  };

  // Handle theme addition
  const handleAddTheme = async () => {
    if (!selectedMasterCategory || !themeName || !newThemeImage) {
      toast.error("Please fill all fields and upload an image");
      return;
    }

    setIsAddingTheme(true);
    const formData = new FormData();
    formData.append("master_category", selectedMasterCategory.value);
    formData.append("theme_name", themeName);
    formData.append("image", newThemeImage);

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/offer-themes/",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const newTheme = await response.json();
        setThemes((prev) => [...prev, newTheme]);
        setThemeName("");
        setSelectedMasterCategory(null);
        setNewThemeImage(null);
        document.getElementById("theme-image-upload").value = "";
        toast.success("Theme added successfully");
      } else {
        throw new Error("Failed to add theme");
      }
    } catch (error) {
      console.error("Error adding theme:", error);
      toast.error("Failed to add theme");
    } finally {
      setIsAddingTheme(false);
    }
  };

  // States for text styling and positioning
  const [textElements, setTextElements] = useState({
    offerName: {
      text: "",
      fontFamily: "Arial",
      fontSize: 24,
      fontWeight: "bold",
      color: "#000000",
      x: 20,
      y: 20,
      isSelected: false,
      width: 200,
      height: 40,
      selectedRange: null, // For tracking text selection within element
    },
    actualPrice: {
      text: "",
      fontFamily: "Arial",
      fontSize: 20,
      fontWeight: "normal",
      color: "#000000",
      x: 20,
      y: 70,
      isSelected: false,
      width: 100,
      height: 30,
      selectedRange: null,
      decoration: "line-through", // For strikethrough effect
    },
    discountedPrice: {
      text: "",
      fontFamily: "Arial",
      fontSize: 24,
      fontWeight: "bold",
      color: "#FF0000",
      x: 130,
      y: 70,
      isSelected: false,
      width: 100,
      height: 30,
      selectedRange: null,
    },
  });

  const [textSelectionMode, setTextSelectionMode] = useState(false);
  const [activeTextElement, setActiveTextElement] = useState(null);

  const [selectedTextElement, setSelectedTextElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState(null);

  // Font options
  const fontOptions = [
    "Arial",
    "Verdana",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Palatino",
    "Garamond",
    "Comic Sans MS",
    "Impact",
    "Lucida Sans",
    "Tahoma",
  ];

  // Font weight options
  const fontWeightOptions = [
    { value: "normal", label: "Normal" },
    { value: "bold", label: "Bold" },
    { value: "bolder", label: "Bolder" },
    { value: "lighter", label: "Lighter" },
    { value: "100", label: "Thin" },
    { value: "200", label: "Extra Light" },
    { value: "300", label: "Light" },
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi Bold" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra Bold" },
    { value: "900", label: "Black" },
  ];

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
  }, []);

  useEffect(() => {
    if (endDate && editorRef.current) {
      const validTillText = `<li>Valid till ${formatExpireDate(endDate)}</li>`;
      const existingContent = editorRef.current.root.innerHTML;

      if (existingContent.includes("Valid till")) {
        editorRef.current.root.innerHTML = existingContent.replace(
          /<li>Valid till .*?<\/li>/,
          validTillText
        );
      } else {
        editorRef.current.root.innerHTML =
          `<ul>${validTillText}</ul>` + (existingContent || "");
      }
    }
  }, [endDate]);

  useEffect(() => {
    if (
      editorRef.current &&
      profileOffers?.profileOffers?.terms_and_conditions &&
      !initialContentSet
    ) {
      const existingContent = profileOffers.profileOffers.terms_and_conditions;
      const expireDate = profileOffers.profileOffers.expire_date;

      if (!existingContent.includes("Valid till") && expireDate) {
        const validTillText = `<li>Valid till ${formatExpireDate(
          expireDate
        )}</li>`;
        editorRef.current.root.innerHTML =
          `<ul>${validTillText}</ul>` + existingContent;
      } else {
        editorRef.current.root.innerHTML = existingContent;
      }
      setInitialContentSet(true);
    }
  }, [profileOffers, initialContentSet]);

  // Update text elements when form values change
  useEffect(() => {
    setTextElements((prev) => ({
      ...prev,
      offerName: {
        ...prev.offerName,
        text: offerName,
      },
      actualPrice: {
        ...prev.actualPrice,
        text: actualPrice ? `₹${actualPrice}` : "",
      },
      discountedPrice: {
        ...prev.discountedPrice,
        text: discountedPrice ? `₹${discountedPrice}` : "",
      },
    }));
  }, [offerName, actualPrice, discountedPrice]);

  // Fetch categories from the API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salons/mastercategory/"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
    getCity();
  }, []);

  // Handle the selection of a theme image.
  const handleThemeSelect = (imageURL) => {
    setBackgroundImage(imageURL);
  };

  // Handle uploading a new theme image
  const handleNewThemeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImageUrl = event.target.result;
        setThemeImages([...themeImages, newImageUrl]);
        setBackgroundImage(newImageUrl);
      };
      reader.readAsDataURL(file);
      setNewThemeImage(file);
    }
  };

  // Text styling handlers
  const handleTextSelection = (elementKey, e) => {
    if (!textSelectionMode) return;

    e.stopPropagation();
    const element = e.target;
    const text = element.innerText;
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const start = range.startOffset;
      const end = range.endOffset;

      if (start !== end) {
        setTextElements((prev) => ({
          ...prev,
          [elementKey]: {
            ...prev[elementKey],
            selectedRange: { start, end },
          },
        }));
        setActiveTextElement(elementKey);
      }
    }
  };

  const applyStyleToSelection = (property, value) => {
    if (!activeTextElement || !textElements[activeTextElement].selectedRange) {
      // Apply to entire element if no selection
      setTextElements((prev) => ({
        ...prev,
        [activeTextElement]: {
          ...prev[activeTextElement],
          [property]: value,
        },
      }));
      return;
    }

    // For selection-based styling, we'll need to use a different approach
    // This is a simplified version - in a real implementation you might want
    // to use a contenteditable div or a more sophisticated approach
    toast.error(
      "Partial text styling requires a more advanced editor implementation"
    );
  };

  // Toggle text selection mode
  const toggleTextSelectionMode = () => {
    setTextSelectionMode(!textSelectionMode);
    if (textSelectionMode) {
      // Clear any selections when exiting selection mode
      setActiveTextElement(null);
      setTextElements((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          updated[key].selectedRange = null;
        });
        return updated;
      });
    }
  };

  // Replace your existing text styling handlers with these:
  const handleFontChange = (font) => {
    if (selectedTextElement) {
      applyStyleToSelection("fontFamily", font);
    }
  };

  const handleFontSizeChange = (size) => {
    if (selectedTextElement) {
      applyStyleToSelection("fontSize", parseInt(size));
    }
  };

  const handleFontWeightChange = (weight) => {
    if (selectedTextElement) {
      applyStyleToSelection("fontWeight", weight);
    }
  };

  const handleColorChange = (color) => {
    if (selectedTextElement) {
      applyStyleToSelection("color", color);
    }
  };

  // Enhanced mouse down handler
  const handleMouseDown = (e, elementKey, type) => {
    if (textSelectionMode) {
      // Allow text selection when in selection mode
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (type === "resize") {
      setIsResizing(true);
      setResizeDirection(elementKey);
    } else {
      setIsDragging(true);
      setSelectedTextElement(elementKey);
      setActiveTextElement(elementKey);

      // Clear any text selection when dragging
      setTextElements((prev) => ({
        ...prev,
        [elementKey]: {
          ...prev[elementKey],
          selectedRange: null,
        },
      }));

      const rect = e.target.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Replace your renderResizeHandles function with this:
  const renderResizeHandles = (elementKey) => {
    if (selectedTextElement !== elementKey || textSelectionMode) return null;

    return (
      <>
        <div
          className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize"
          style={{ right: -6, bottom: -6 }}
          onMouseDown={(e) => handleMouseDown(e, "se", "resize")}
        />
        <div
          className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize"
          style={{ left: -6, bottom: -6 }}
          onMouseDown={(e) => handleMouseDown(e, "sw", "resize")}
        />
        <div
          className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize"
          style={{ right: -6, top: -6 }}
          onMouseDown={(e) => handleMouseDown(e, "ne", "resize")}
        />
        <div
          className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize"
          style={{ left: -6, top: -6 }}
          onMouseDown={(e) => handleMouseDown(e, "nw", "resize")}
        />
      </>
    );
  };

  const handleCanvasClick = (e) => {
    // Deselect all text elements when clicking on canvas
    if (e.target === canvasRef.current) {
      setSelectedTextElement(null);
      setTextElements((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          updated[key].isSelected = false;
        });
        return updated;
      });
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && selectedTextElement) {
      setTextElements((prev) => ({
        ...prev,
        [selectedTextElement]: {
          ...prev[selectedTextElement],
          x: Math.max(
            0,
            Math.min(
              rect.width - prev[selectedTextElement].width,
              x - dragOffset.x
            )
          ),
          y: Math.max(
            0,
            Math.min(
              rect.height - prev[selectedTextElement].height,
              y - dragOffset.y
            )
          ),
        },
      }));
    } else if (isResizing && selectedTextElement) {
      const element = textElements[selectedTextElement];
      let newWidth = element.width;
      let newHeight = element.height;

      if (resizeDirection.includes("e")) newWidth = Math.max(50, x - element.x);
      if (resizeDirection.includes("s"))
        newHeight = Math.max(20, y - element.y);

      setTextElements((prev) => ({
        ...prev,
        [selectedTextElement]: {
          ...prev[selectedTextElement],
          width: newWidth,
          height: newHeight,
        },
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  const captureCanvasImage = () => {
    if (!canvasRef.current) return null;

    const canvas = document.createElement("canvas");
    canvas.width = 280;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");

    // Draw background
    if (backgroundImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = backgroundImage;
      ctx.drawImage(img, 0, 0, 280, 160);
    } else {
      ctx.fillStyle = "#e5e7eb";
      ctx.fillRect(0, 0, 280, 160);
    }

    // Draw text elements
    Object.values(textElements).forEach((element) => {
      if (element.text) {
        ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
        ctx.fillStyle = element.color;

        // Handle text decoration
        if (element.decoration === "line-through") {
          ctx.fillText(element.text, element.x, element.y + element.height / 2);
          ctx.beginPath();
          ctx.moveTo(element.x, element.y + element.height / 2 - 2);
          ctx.lineTo(
            element.x + ctx.measureText(element.text).width,
            element.y + element.height / 2 - 2
          );
          ctx.strokeStyle = element.color;
          ctx.stroke();
        } else {
          ctx.fillText(element.text, element.x, element.y + element.height / 2);
        }
      }
    });

    return canvas.toDataURL("image/png");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !offerTime?.days &&
      !offerTime?.hours &&
      !offerTime?.minutes &&
      !offerTime?.seating
    ) {
      toast.error("At least one option in offer time is required", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "red",
          color: "#FFFFFF",
        },
      });
      return;
    }

    const imageDataURL = captureCanvasImage();
    if (imageDataURL) {
      // Convert data URL to blob
      const response = await fetch(imageDataURL);
      const blob = await response.blob();
      const file = new File([blob], "offer-image.png", { type: "image/png" });
      setGeneratedImage(file);
    }

    setIsSubmitting(true);
    const formData = new FormData();
    selectedSalons.forEach((salon) =>
      formData.append("salon_ids", salon.value)
    );
    formData.append("name", offerName);
    formData.append("city", selectedCity);
    formData.append("actual_price", actualPrice);
    formData.append("discount_price", discountedPrice);
    formData.append("terms_and_conditions", editorRef.current.root.innerHTML);
    formData.append("gender", gender);
    formData.append("starting_date", startDate);
    formData.append("expire_date", endDate);
    formData.append(
      "offer_time",
      JSON.stringify({
        days: offerTime?.days || 0,
        hours: offerTime?.hours || 0,
        minutes: offerTime?.minutes || 0,
        seating: offerTime?.seating || 0,
      })
    );

    // Add text styling data
    formData.append("text_styling", JSON.stringify(textElements));

    if (generatedImage) {
      formData.append("image", generatedImage);
    }
    if (selectedCategory) {
      formData.append("category_id", selectedCategory.id);
    }
    if (newThemeImage) {
      formData.append("theme_image", newThemeImage);
    }

    let method, url;
    if (profileOffers?.profileOffers) {
      method = "PATCH";
      url = `https://backendapi.trakky.in/salons/salon-profile-offer/${profileOffers?.profileOffers?.id}/`;
    } else {
      method = "POST";
      url = `https://backendapi.trakky.in/salons/salon-profile-offer/`;
    }

    try {
      let response = await fetch(url, {
        method: method,
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      if (profileOffers?.profileOffers) {
        if (response.status === 200) {
          toast.success("Updated successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "green",
              color: "#fff",
            },
          });
          profileOffers.setProfileOffers(responseData);
        } else if (
          response.status === 400 &&
          responseData.salons &&
          responseData.salons.length > 0
        ) {
          toast.error(responseData.salons[0], {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#fff",
            },
          });
        } else if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else {
          toast.error(`Error : ${response.status} - ${response.statusText}`, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#fff",
            },
          });
        }
      } else {
        if (response.status === 201) {
          toast.success("Added successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "green",
              color: "#fff",
            },
          });
          setActualPrice("");
          setDiscountedPrice("");
          setOfferName("");
          setImg(null);
          editorRef.current.root.innerHTML = "";
          document.getElementById("img").value = "";
          setBackgroundImage(null);
          setSelectedCategory(null);
          setTextElements({
            offerName: {
              text: "",
              fontFamily: "Arial",
              fontSize: 24,
              fontWeight: "bold",
              color: "#000000",
              x: 20,
              y: 20,
              isSelected: false,
              width: 200,
              height: 40,
            },
            price: {
              text: "",
              fontFamily: "Arial",
              fontSize: 20,
              fontWeight: "bold",
              color: "#000000",
              x: 20,
              y: 60,
              isSelected: false,
              width: 200,
              height: 40,
            },
          });
        } else if (
          response.status === 400 &&
          responseData.salons &&
          responseData.salons.length > 0
        ) {
          toast.error(responseData.salons[0], {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#fff",
            },
          });
        } else if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else {
          toast.error(`Error : ${response.status} - ${response.statusText}`, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#fff",
            },
          });
        }
      }
    } catch (error) {
      toast.error("Failed to add. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "red",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/salons/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let city = data?.payload.map((item) => item.name);
        setCity(city);
      })
      .catch((err) => alert(err));
  };

  const loadSalons = async (inputValue, callback) => {
    if (inputValue !== "") {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
            inputValue
          )}&city=${selectedCity}`
        );

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const data = await response.json();

        const options = data?.results?.map((salon) => ({
          value: salon.id,
          label: salon.name,
        }));

        callback(options);
      } catch (error) {
        console.error("Error fetching salons:", error.message);
        callback([]);
      }
    }
  };

  return (
    <>
      <Toaster />
      <div className="p-4 font-sans min-h-screen">
        <form
          method="post"
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Part 1: Theme Part - unchanged */}
          <div className="flex-1  p-6 rounded-xl  w-[33%]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              1. Select a Theme
            </h2>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search Theme or Category"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <div
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 whitespace-nowrap ${
                    !selectedCategory
                      ? "bg-blue-600 text-white"
                      : " border border-black text-gray-700 "
                  }`}
                >
                  All
                </div>
                {categories
                  .filter((cat) =>
                    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 whitespace-nowrap ${
                        selectedCategory?.id === cat.id
                          ? "bg-blue-600 text-white"
                          : " border border-black text-gray-700 "
                      }`}
                    >
                      {cat.name} - {cat.gender}
                    </div>
                  ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Theme Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {themes
                  .filter((theme) => {
                    const matchesSearch =
                      theme.theme_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      (theme.master_category_name &&
                        theme.master_category_name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()));

                    const matchesCategory =
                      !selectedCategory ||
                      theme.master_category === selectedCategory.id;

                    return matchesSearch && matchesCategory;
                  })
                  .map((theme) => (
                    <div
                      key={theme.id}
                      className={`relative rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105 group ${
                        backgroundImage === theme.image
                          ? "ring-4 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => handleThemeSelect(theme.image)}
                    >
                      <img
                        src={
                          theme.image ||
                          "https://placehold.co/800x450/cccccc/666666?text=No+Image"
                        }
                        alt={theme.theme_name}
                        className="w-full h-auto"
                      />

                      {/* Edit/Delete buttons - hidden until hover */}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* Edit Icon */}
                        <button className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>

                        {/* Delete Icon */}
                        <button
                          className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTheme(theme.id);
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Add New Theme</h3>

              {/* Master Category Selection */}
              <div className="mb-3">
                <label className="block text-gray-700 font-medium mb-2">
                  Master Category
                </label>
                <AsyncSelect
                  defaultOptions
                  loadOptions={loadMasterCategories}
                  value={selectedMasterCategory}
                  onChange={setSelectedMasterCategory}
                  placeholder="Search master category..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#ccc",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#ccc" },
                    }),
                  }}
                />
              </div>

              {/* Theme Name */}
              <div className="mb-3">
                <label className="block text-gray-700 font-medium mb-2">
                  Theme Name
                </label>
                <input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="Enter theme name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Theme Image Upload */}
              <div className="mb-3">
                <label className="block text-gray-700 font-medium mb-2">
                  Theme Image
                </label>
                <input
                  id="theme-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleNewThemeUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Add Theme Button */}
              <button
                onClick={handleAddTheme}
                disabled={isAddingTheme}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isAddingTheme ? "Adding Theme..." : "Add Theme"}
              </button>
            </div>
          </div>

          {/* Part 2: Form Part */}
          <div className="flex-1 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              2. Offer Details
            </h2>
            <div className="row">
              <div className="input-box inp-id col-1 col-2">
                <label htmlFor="id">Select City</label>
                <select
                  disabled={profileOffers?.profileOffers}
                  name="id"
                  id="id"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedSalons([]);
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
            <div className="row">
              <div className="input-box inp-salon col-1 col-2 relative">
                <label htmlFor="salons">
                  Select Salon
                  <span className="Note_Inp_Classs">
                    Salon Must belong to Selected city
                  </span>
                </label>
                <AsyncSelect
                  isMulti
                  required
                  isDisabled={!selectedCity || profileOffers?.profileOffers}
                  defaultOptions
                  loadOptions={loadSalons}
                  value={selectedSalons}
                  onChange={(selectedSalons) => {
                    setSelectedSalons(selectedSalons);
                  }}
                  noOptionsMessage={() => "No salons found"}
                  placeholder="Search Salon..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#ccc",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#ccc",
                      },
                    }),
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="service-name">Enter Offer Name</label>
                <input
                  required
                  type="text"
                  name="offername"
                  id="offername"
                  value={offerName}
                  placeholder="Enter name here.."
                  onChange={(e) => setOfferName(e.target.value)}
                />
              </div>
              <div className="input-box inp-id col-1 col-2">
                <label htmlFor="gender">Select Gender</label>
                <select
                  name="gender"
                  id="gender"
                  required
                  value={gender || ""}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                >
                  <option value="">---Select---</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="service-name">Enter Actual Price</label>
                <input
                  required
                  type="text"
                  name="actualPrice"
                  id="actualPrice"
                  value={actualPrice}
                  placeholder="Enter actual price here.."
                  onChange={(e) => setActualPrice(e.target.value)}
                />
              </div>
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="service-name">Enter Discounted Price</label>
                <input
                  required
                  type="text"
                  name="discountedPrice"
                  id="discountedPrice"
                  value={discountedPrice}
                  placeholder="Enter discounted price here.."
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-box inp-id col-1 col-2">
                <label htmlFor="all-service">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  id="start_date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                />
              </div>
              <div className="input-box inp-id col-1 col-2">
                <label htmlFor="all-service">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-box inp-name col-1 col-2">
                <label htmlFor="content">Terms & Conditions</label>
                <div
                  id="editor"
                  style={{ width: "100%", height: "100px" }}
                ></div>
              </div>
            </div>

            <div className="row col-2 !gap-4 !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4">
              <div className="input-box inp-time col-1">
                <label htmlFor="service-time">Total hours</label>
                <input
                  type="number"
                  name="service-time"
                  id="service-time"
                  value={offerTime?.hours || ""}
                  placeholder="Hours : E.g. 0 , 1 , 2 ... "
                  onChange={(e) => {
                    setOfferTime({ ...offerTime, hours: e.target.value });
                  }}
                  onWheel={() => document.activeElement.blur()}
                  onKeyDownCapture={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="input-box inp-time col-1 ">
                <label htmlFor="service-time">Total Minutes</label>
                <input
                  type="number"
                  name="service-time"
                  id="service-time"
                  value={offerTime?.minutes || ""}
                  onChange={(e) => {
                    setOfferTime({ ...offerTime, minutes: e.target.value });
                  }}
                  placeholder="Minutes : E.g. 0 , 15 , 30 , 45 , 60 ..."
                  onWheel={() => document.activeElement.blur()}
                  onKeyDownCapture={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="input-box inp-time col-1 ">
                <label htmlFor="service-time">Total Seating</label>
                <input
                  type="number"
                  name="service-time"
                  id="service-time"
                  value={offerTime?.seating || ""}
                  onChange={(e) => {
                    setOfferTime({ ...offerTime, seating: e.target.value });
                  }}
                  placeholder="Seating : E.g. 0 , 1 , 2 .."
                  onWheel={() => document.activeElement.blur()}
                  onKeyDownCapture={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="input-box inp-time col-1 ">
                <label htmlFor="service-time">Total Days</label>
                <input
                  disabled
                  type="number"
                  name="service-time"
                  id="service-time"
                  value={offerTime?.days || ""}
                  onChange={(e) => {
                    setOfferTime({ ...offerTime, days: e.target.value });
                  }}
                  placeholder="Days : E.g. 0 , 1 , 2 ..."
                  onWheel={() => document.activeElement.blur()}
                  onKeyDownCapture={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-box inp-main-img col-1 col-2">
                <label>
                  Image
                  <span className="Note_Inp_Classs">
                    Recommended Image Ratio 16:9
                  </span>
                </label>
                <input
                  type="file"
                  name="img"
                  id="img"
                  placeholder="Enter Image"
                  accept="image/*"
                  style={{ width: "fit-content", cursor: "pointer" }}
                  onChange={(e) => setImg(e.target.files[0])}
                />
              </div>
            </div>
          </div>

          {/* Part 3: Live Preview Part */}
          <div className="flex-1 p-6 rounded-xl flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              3. Live Preview
            </h2>

            {/* Text selection mode toggle */}
            <div className="mb-4 flex items-center">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={textSelectionMode}
                    onChange={toggleTextSelectionMode}
                  />
                  <div
                    className={`block w-14 h-7 rounded-full ${
                      textSelectionMode ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition transform ${
                      textSelectionMode ? "translate-x-7" : ""
                    }`}
                  ></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                  Text Selection Mode
                </div>
              </label>
              {textSelectionMode && (
                <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Click and drag to select text within elements
                </span>
              )}
            </div>

            {/* Text styling controls */}
            {selectedTextElement && (
              <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  {textSelectionMode &&
                  textElements[selectedTextElement].selectedRange
                    ? "Selected Text Styling"
                    : `${selectedTextElement
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())} Styling`}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Font Family
                    </label>
                    <select
                      value={textElements[selectedTextElement].fontFamily}
                      onChange={(e) => handleFontChange(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {fontOptions.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Font Size
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={textElements[selectedTextElement].fontSize}
                        onChange={(e) => handleFontSizeChange(e.target.value)}
                        className="flex-1"
                      />
                      <span className="ml-2 w-10 text-center">
                        {textElements[selectedTextElement].fontSize}px
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Font Weight
                    </label>
                    <select
                      value={textElements[selectedTextElement].fontWeight}
                      onChange={(e) => handleFontWeightChange(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {fontWeightOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={textElements[selectedTextElement].color}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <span className="ml-2 text-xs">
                        {textElements[selectedTextElement].color}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedTextElement === "actualPrice" && (
                  <div className="mt-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          textElements.actualPrice.decoration === "line-through"
                        }
                        onChange={(e) =>
                          setTextElements((prev) => ({
                            ...prev,
                            actualPrice: {
                              ...prev.actualPrice,
                              decoration: e.target.checked
                                ? "line-through"
                                : "none",
                            },
                          }))
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">Strikethrough</span>
                    </label>
                  </div>
                )}
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                {textSelectionMode
                  ? "Click and drag to select text within elements for styling"
                  : "Click on text elements to select and customize them. Drag to reposition. Use handles to resize."}
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div
                ref={canvasRef}
                className="w-[280px] h-[160px] rounded-[15px] shadow-xl border-4 border-gray-300 relative overflow-hidden bg-gray-200"
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  cursor: isDragging
                    ? "grabbing"
                    : textSelectionMode
                    ? "text"
                    : "default",
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleCanvasClick}
              >
                {!backgroundImage && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm p-2 text-center">
                    Select a theme image to see the preview
                  </div>
                )}

                {/* Text elements */}
                {Object.entries(textElements).map(
                  ([key, element]) =>
                    element.text && (
                      <div
                        key={key}
                        className={`absolute cursor-move p-1 rounded ${
                          element.isSelected
                            ? "ring-2 ring-blue-500 bg-blue-50 bg-opacity-50"
                            : ""
                        } ${textSelectionMode ? "select-text" : ""}`}
                        style={{
                          left: `${element.x}px`,
                          top: `${element.y}px`,
                          fontFamily: element.fontFamily,
                          fontSize: `${element.fontSize}px`,
                          fontWeight: element.fontWeight,
                          color: element.color,
                          width: `${element.width}px`,
                          height: `${element.height}px`,
                          minWidth: "30px",
                          minHeight: "20px",
                          textDecoration: element.decoration || "none",
                          userSelect: textSelectionMode ? "text" : "none",
                          cursor: textSelectionMode ? "text" : "move",
                        }}
                        onMouseDown={(e) => handleMouseDown(e, key)}
                        onClick={(e) => {
                          if (!textSelectionMode) {
                            handleTextSelection(key, e);
                          } else {
                            handleTextSelection(key, e);
                          }
                        }}
                        onMouseUp={
                          textSelectionMode
                            ? (e) => handleTextSelection(key, e)
                            : undefined
                        }
                      >
                        {element.text}
                        {renderResizeHandles(key)}

                        {/* Highlight selected text range */}
                        {element.selectedRange && (
                          <div
                            className="absolute bg-blue-200 opacity-50 pointer-events-none"
                            style={{
                              left: "0",
                              top: "0",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        )}
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Preview actions */}
            <div className="flex justify-center items-center mt-4">
              {/* <div className="text-sm text-gray-500">
                                Size: 280×160px (Mobile Optimized)
                            </div> */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Offer"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSalonProfileOfferWithTheme;
