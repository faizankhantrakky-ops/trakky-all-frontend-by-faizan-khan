import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown } from 'react-icons/md';
import { MdKeyboardArrowUp } from 'react-icons/md';
import { MdFormatListBulleted } from 'react-icons/md';
import { MdAdd } from 'react-icons/md';
import { MdCall } from 'react-icons/md';
import { MdBookmarkBorder } from 'react-icons/md';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { MdArrowBack } from 'react-icons/md';
import { MdInfoOutline } from 'react-icons/md';
import { MdSearch } from 'react-icons/md';
import logo from "../trakky_logo.png";
import AuthContext from "../Context/AuthContext";

const New_Sidebar = (props) => {
  const { userPermissions } = useContext(AuthContext);
  const [selected, setSelected] = useState(null);
  const [selecetedbtn, setSelectedbtn] = useState(1);
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get mode from query parameters
  const getCurrentMode = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("mode");
  };

  const currentMode = getCurrentMode();

  // Define menu items for different modes
  const getMenuByMode = () => {
    const mode = currentMode;

if (mode === "inquiry") {
  return [
    {
      type: "normal",
      title: "Dashboard",
      link: "/dashboard",
      link2: "/",
      number: 1,
    },
    {
      type: "normal",
      title: "Customers",
      link: "/customers",
      number: 2,
    },
    {
      type: "dropdown",
      title: "Salon Scores",
      items: [
        {
          type: "normal",
          title: "Salon Scores",
          icon: <MdFormatListBulleted size={20} />,
          link: "/userreviews",
          number: 4,
        },
        {
          title: "Add Salon Scores",
          link: "/addsalonscores",
          icon: <MdAdd size={20} />,
          number: 5,
        },
      ],
    },
    {
      type: "normal",
      title: "Trakky Ratings",
      link: "/ratings",
      number: 6,
    },
    {
      type: "normal",
      title: "Contact Us",
      link: "/usercontactus",
      number: 8,
    },
    {
      type: "normal",
      title: "Inquiries",
      link: "/inquiry",
      number: 7,
    },
    {
      type: "normal",
      title: "Create User",
      link: "/createuser",
      number: 3,
    },
  ];
}

if (mode === "salon") {
  return [
    {
      type: "normal",
      title: "Dashboard",
      link: "/dashboard",
      link2: "/",
      number: 1,
    },
    {
      type: "dropdown",
      title: "Salons",
      items: [
        {
          title: "List Salons",
          link: "/listsalons",
          icon: <MdFormatListBulleted size={20} />,
          number: 9,
        },
        {
          title: "Add Salon",
          link: "/addsalon",
          icon: <MdAdd size={20} />,
          number: 10,
        },
        {
          title: "New Salon Requests",
          link: "/newsalonrequests",
          icon: <MdFormatListBulleted size={20} />,
          number: 11,
        },
        {
          title: "Collaborated Salons",
          link: "/collaborated",
          icon: <MdFormatListBulleted size={20} />,
          number: 12,
        },
        {
          title: "Add Collaborated Salons",
          link: "/addcollaborated",
          icon: <MdAdd size={20} />,
          number: 13,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Salons Categories",
      items: [
        {
          title: "List Top Rated",
          link: "/topratedsalons",
          icon: <MdFormatListBulleted size={20} />,
          number: 110,
        },
        {
          title: "List Bridal",
          link: "/listbridal",
          icon: <MdFormatListBulleted size={20} />,
          number: 14,
        },
        {
          title: "Academy Salons",
          link: "/academysalons",
          icon: <MdFormatListBulleted size={20} />,
          number: 15,
        },
        {
          title: "Makeup",
          link: "/makeup",
          icon: <MdFormatListBulleted size={20} />,
          number: 16,
        },
        {
          title: "Female Beauty Parlour",
          link: "/femalebeautyparlour",
          icon: <MdFormatListBulleted size={20} />,
          number: 17,
        },
        {
          title: "Kids Special",
          link: "/kidsspecial",
          icon: <MdFormatListBulleted size={20} />,
          number: 18,
        },
        {
          title: "Male Salons",
          link: "/malesalons",
          icon: <MdFormatListBulleted size={20} />,
          number: 19,
        },
        {
          title: "Unisex Salons",
          link: "/unisexsalons",
          icon: <MdFormatListBulleted size={20} />,
          number: 20,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Priority Management",
      items: [
        {
          title: "City and Area Priority",
          link: "/cityandareapriority",
          icon: <MdFormatListBulleted size={20} />,
          number: 22,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Master",
      items: [
        {
          title: "Master Services",
          link: "/masterservices",
          icon: <MdFormatListBulleted size={20} />,
          number: 23,
        },
        {
          title: "Master Services Form",
          link: "/masterservicesform",
          icon: <MdAdd size={20} />,
          number: 24,
        },
        {
          title: "Master Categories",
          link: "/mastercategories",
          icon: <MdFormatListBulleted size={20} />,
          number: 25,
        },
        {
          title: "Master Category Form",
          link: "/mastercategoryform",
          icon: <MdAdd size={20} />,
          number: 26,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Master Product",
      items: [
        {
          title: "Master Product List",
          link: "/productmasterlist",
          icon: <MdFormatListBulleted size={20} />,
          number: 71,
        },
        {
          title: "Master Product Form",
          link: "/productmasterservicesfrom",
          icon: <MdAdd size={20} />,
          number: 70,
        },
        {
          title: "Salon Product List",
          link: "/SalonProductList",
          icon: <MdFormatListBulleted size={20} />,
          number: 73,
        },
        {
          title: "Salon Product From",
          link: "/SalonProductFrom",
          icon: <MdAdd size={20} />,
          number: 72,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Category",
      items: [
        {
          title: "List National Categories",
          link: "/listnationalcategories",
          icon: <MdFormatListBulleted size={20} />,
          number: 27,
        },
        {
          title: "Add National Category",
          link: "/addnationalcategory",
          icon: <MdAdd size={20} />,
          number: 28,
        },
        {
          title: "List Categories",
          link: "/listcategories",
          icon: <MdFormatListBulleted size={20} />,
          number: 29,
        },
        {
          title: "Add Category",
          link: "/addcategory",
          icon: <MdAdd size={20} />,
          number: 30,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Salon Services",
      items: [
        {
          title: "List Salon Services",
          link: "/listofservices",
          icon: <MdFormatListBulleted size={20} />,
          number: 31,
        },
        {
          title: "Add Salon Service",
          link: "/addservice",
          icon: <MdAdd size={20} />,
          number: 32,
        },
        {
          title: "List Service details",
          link: "/list-service-details",
          icon: <MdFormatListBulleted size={20} />,
          number: 68,
        },
        {
          title: "Add Service details",
          link: "/add-service-details",
          icon: <MdAdd size={20} />,
          number: 69,
        },
        {
          title: "List Master Overview",
          link: "/master-overview-details",
          icon: <MdFormatListBulleted size={20} />,
          number: 76,
        },
        {
          title: "Add Master Overview",
          link: "/add-master-overview",
          icon: <MdAdd size={20} />,
          number: 77,
        },
      ],
    },

    {
      type: "dropdown",
      title: "Upload Image Service",
      items: [
        {
          title: "List of Service Image",
          link: "/list-service-images",
          icon: <MdFormatListBulleted size={20} />,
          number: 78,
        },
        {
          title: "Add of Service Image",
          link: "/add-service-image",
          icon: <MdAdd size={20} />,
          number: 79,
        },
      ],
    },
    {
      type: "dropdown", 
      title: "National/City Hero Offers",
      items: [
        {
          title: "National/City Hero Offers",
          link: "/nationalherooffers",
          icon: <MdFormatListBulleted size={20} />,
          number: 33,
        },
        {
          title: "Add National/City Hero Offers",
          link: "/addnationalherooffers",
          icon: <MdAdd size={20} />,
          number: 34,
        },
      ],
    },
    {
      type: "dropdown",
      title: "City Offers",
      items: [
        {
          title: "List City/Area Offers",
          link: "/listoffer",
          icon: <MdFormatListBulleted size={20} />,
          number: 35,
        },
        {
          title: "Add City/Area Offer",
          link: "/addoffer",
          icon: <MdAdd size={20} />,
          number: 36,
        },
        {
          title: "Primary City Offers",
          link: "/cityOffers",
          icon: <MdFormatListBulleted size={20} />,
          number: 37,
        },
        {
          title: "Add Primary City Offer",
          link: "/addcityOffers",
          icon: <MdAdd size={20} />,
          number: 38,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Salon Specific",
      items: [
        {
          title: "List Salon Profile Offer",
          link: "/salonprofileoffer",
          icon: <MdFormatListBulleted size={20} />,
          number: 39,
        },
        {
          title: "Add Salon Profile Offer",
          link: "/addsalonprofileoffer",
          icon: <MdAdd size={20} />,
          number: 40,
        },
       
        {
          title: "List Offer Tags",
          link: "/listoffertags",
          icon: <MdFormatListBulleted size={20} />,
          number: 41,
        },
        {
          title: "Add Offer Tags",
          link: "/addoffertags",
          icon: <MdAdd size={20} />,
          number: 42,
        },
        {
          title: "List Salon Service Packages",
          link: "/listservicepackages",
          icon: <MdFormatListBulleted size={20} />,
          number: 43,
        },
        {
          title: "Add Salon Service Packages",
          link: "/addservicepackages",
          icon: <MdAdd size={20} />,
          number: 44,
        },
        {
          title: "List salon main offers",
          link: "/listmainoffers",
          icon: <MdFormatListBulleted size={20} />,
          number: 74,
        },
        {
          title: "Add salon main offers",
          link: "/addmainoffers",
          icon: <MdAdd size={20} />,
          number: 75,
        },
         {
          title: "Salon With Profile Offer",
          link: "/salonwithprofileoffer",
          icon: <MdFormatListBulleted size={20} />,
          number: 80,
        },
        
      ],
    },
    {
      type: "dropdown",
      title: "National Specific",
      items: [
        {
          title: "List Featured This Week",
          link: "/featuredthisweek",
          icon: <MdFormatListBulleted size={20} />,
          number: 45,
        },
        {
          title: "Add Featured This Week",
          link: "/addfeaturedthisweek",
          icon: <MdAdd size={20} />,
          number: 46,
        },
        {
          title: "List National Offer",
          link: "/listnationaloffer",
          icon: <MdFormatListBulleted size={20} />,
          number: 47,
        },
        {
          title: "Add National Offer",
          link: "/addnationaloffer",
          icon: <MdAdd size={20} />,
          number: 48,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Client Work Photos",
      items: [
        {
          title: "List Client Work",
          link: "/listclientworkphotos",
          icon: <MdFormatListBulleted size={20} />,
          number: 51,
        },
        {
          title: "Add Client Work Photos",
          link: "/addclientworkphotos",
          icon: <MdAdd size={20} />,
          number: 52,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Cities/Areas",
      items: [
        {
          title: "List Cities",
          link: "/listcities",
          icon: <MdFormatListBulleted size={20} />,
          number: 53,
        },
        {
          title: "Add City",
          link: "/addcity",
          icon: <MdAdd size={20} />,
          number: 54,
        },
        {
          title: "List Areas",
          link: "/listareas",
          icon: <MdFormatListBulleted size={20} />,
          number: 55,
        },
        {
          title: "Add Area",
          link: "/addarea",
          icon: <MdAdd size={20} />,
          number: 56,
        },
      ],
    },
    {
      type: "dropdown",
      title: "POS Request",
      items: [
        {
          title: "List category request",
          link: "/list-category-request",
          icon: <MdFormatListBulleted size={20} />,
          number: 63,
        },
        {
          title: "list service request",
          link: "/list-service-request",
          icon: <MdFormatListBulleted size={20} />,
          number: 64,
        },
        {
          title: "list Offer request",
          link: "/list-offer-request",
          icon: <MdFormatListBulleted size={20} />,
          number: 64,
        },
        {
          title: "list Package request",
          link: "/list-package-request",
          icon: <MdFormatListBulleted size={20} />,
          number: 64,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Vendors",
      items: [
        {
          title: "List Vendors",
          link: "/listvendors",
          icon: <MdFormatListBulleted size={20} />,
          number: 63,
        },
        {
          title: "Add Vendor",
          link: "/addvendor",
          icon: <MdAdd size={20} />,
          number: 64,
        },
      ],
    },
    {
      type: "normal",
      title: "Logs",
      link: "/logs",
      number: 65,
    },
    {
      type: "normal",
      title: "Pos Salon Request",
      link: "/pos-Salon-request",
      number: 75,
    },
  ];
}

if (mode === "request") {
  return [
    {
      type: "normal",
      title: "Dashboard",
      link: "/dashboard",
      link2: "/",
      number: 1,
    },
    {
      type: "dropdown",
      title: "POS Request",
      items: [
        {
          title: "List category request",
          link: "/list-category-request",
          icon: <MdFormatListBulleted size={20} />,
          number: 63,
        },
        {
          title: "list service request",
          link: "/list-service-request",
          icon: <MdFormatListBulleted size={20} />,
          number: 64,
        },
        {
          title: "list Offer request",
          link: "/list-offer-request",
          icon: <MdFormatListBulleted size={20} />,
          number: 64,
        },
        {
          title: "list Package request",
          link: "/list-package-request",
          icon: <MdFormatListBulleted size={20} />,
          number: 64,
        },
      ],
    },
  ];
}

if (mode === "marketing") {
  return [
    {
      type: "normal",
      title: "Dashboard",
      link: "/dashboard",
      link2: "/",
      number: 1,
    },
    {
      type: "dropdown",
      title: "Daily Updates",
      items: [
        {
          title: "List Daily Updates",
          link: "/listdailyupdates",
          icon: <MdFormatListBulleted size={20} />,
          number: 49,
        },
        {
          title: "Add Daily Updates",
          link: "/adddailyupdates",
          icon: <MdAdd size={20} />,
          number: 50,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Blogs",
      items: [
        {
          title: "Blog User Emails",
          link: "/bloguseremails",
          icon: <MdFormatListBulleted size={20} />,
          number: 57,
        },
        {
          title: "SEO Management",
          link: "/blogseomanagement",
          icon: <MdFormatListBulleted size={20} />,
          number: 58,
        },
        {
          title: "List Blogs",
          link: "/listblogs",
          icon: <MdFormatListBulleted size={20} />,
          number: 59,
        },
        {
          title: "Add Blog",
          link: "/addblogs",
          icon: <MdAdd size={20} />,
          number: 60,
        },
        {
          title: "Blog Categories",
          link: "/blogcategories",
          icon: <MdFormatListBulleted size={20} />,
          number: 61,
        },
        {
          title: "Add Blog Category",
          link: "/addblogcategory",
          icon: <MdAdd size={20} />,
          number: 62,
        },
      ],
    },
    // New Menu Added Here - Manage Coupon Code
    {
      type: "dropdown",
      title: "Manage Coupon Code",
      items: [
        {
          title: "Coupon Code List",
          link: "/coupon-list",
          icon: <MdFormatListBulleted size={20} />,
          number: 999,
        },
        {
          title: "Add Coupon Code",
          link: "/add-coupon",
          icon: <MdAdd size={20} />,
          number: 1000,
        },
      ],
    },
  ];
}

if (mode === "setting") {
  return [
    {
      type: "normal",
      title: "Dashboard",
      link: "/dashboard",
      link2: "/",
      number: 1,
    },
    {
      type: "dropdown",
      title: "Permissions",
      items: [
        {
          title: "List Permissions",
          link: "/permissions-data",
          icon: <MdFormatListBulleted size={20} />,
          number: 66,
        },
        {
          title: "Add Permission",
          link: "/custompermissions",
          icon: <MdAdd size={20} />,
          number: 67,
        },
      ],
    },
    {
      type: "dropdown",
      title: "User Creation",
      items: [
        {
          title: "List Users",
          link: "/listadminuser",
          icon: <MdFormatListBulleted size={20} />,
          number: 68,
        },
        {
          title: "Add User",
          link: "/createadminuser",
          icon: <MdAdd size={20} />,
          number: 69,
        },
      ],
    },
    {
      type: "normal",
      title: "Logs",
      link: "/logs",
      number: 65,
    },
  ];
}

// Default: return empty array, will be populated by permissions
return [];

  }
  // Filter function for search
  const filterMenuItems = (items, term) => {
    if (!term) return items;

    const lowerTerm = term.toLowerCase();

    return items
      .map((item) => {
        if (item.type === "normal") {
          if (item.title.toLowerCase().includes(lowerTerm)) {
            return item;
          }
          return null;
        } else if (item.type === "dropdown") {
          const filteredItems = item.items.filter((subItem) =>
            subItem.title.toLowerCase().includes(lowerTerm)
          );
          if (filteredItems.length > 0 || item.title.toLowerCase().includes(lowerTerm)) {
            return {
              ...item,
              items: filteredItems,
              // Auto-expand if any child matches
              autoExpanded: filteredItems.length > 0 && !item.title.toLowerCase().includes(lowerTerm),
            };
          }
          return null;
        }
      })
      .filter(Boolean);
  };

  // Handle back to select mode
  const handleBackToSelectMode = () => {
    navigate("/selectmode");
  };

  // Function to navigate with mode parameter
  const navigateWithMode = (path) => {
    if (currentMode) {
      navigate(`${path}?mode=${currentMode}`);
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    const modeBasedMenu = getMenuByMode();

    // If we're in a specific mode, use the mode-based menu
    if (currentMode && modeBasedMenu.length > 0) {
      setList(modeBasedMenu);
      setFilteredList(filterMenuItems(modeBasedMenu, searchTerm));
      return;
    }

    // Otherwise, use the permission-based menu
    console.log("userPermissions render", userPermissions);

    if (userPermissions?.status == 200) {
      let temp_list = [
        {
          type: "normal",
          title: "Dashboard",
          link: "/dashboard",
          link2: "/",
          number: 1,
        },
      ];

      if (userPermissions?.data?.length > 0) {
        if (
          userPermissions?.data?.[0]?.access?.includes("general-permission")
        ) {
let general_permission = [
  {
    type: "normal",
    title: "Customers",
    link: "/customers",
    number: 2,
  },
  {
    type: "dropdown",
    title: "Salon Scores",
    items: [
      {
        type: "normal",
        title: "Salon Scores",
        icon: <MdFormatListBulleted size={20} />,
        link: "/userreviews",
        number: 4,
      },
      {
        title: "Add Salon Scores",
        link: "/addsalonscores",
        icon: <MdAdd size={20} />,
        number: 5,
      },
    ],
  },
  {
    type: "normal",
    title: "Trakky Ratings",
    link: "/ratings",
    number: 6,
  },
  {
    type: "normal",
    title: "Contact Us",
    link: "/usercontactus",
    number: 8,
  },
  {
    type: "normal",
    title: "Create User",
    link: "/createuser",
    number: 3,
  },
];
          temp_list.push(...general_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes("inquiry-permission")
        ) {
          let inquiry_permission = [
            {
              type: "normal",
              title: "Inquiries",
              link: "/inquiry",
              number: 7,
            },
          ];
          temp_list.push(...inquiry_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("salons-permission")) {
          let salons_permission = [
            {
              type: "dropdown",
              title: "Salons",
              items: [
                {
                  title: "List Salons",
                  link: "/listsalons",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 9,
                },
                {
                  title: "Add Salon",
                  link: "/addsalon",
                  icon: <MdAdd size={20} />,
                  number: 10,
                },
                {
                  title: "New Salon Requests",
                  link: "/newsalonrequests",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 11,
                },
                {
                  title: "Collaborated Salons",
                  link: "/collaborated",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 12,
                },
                {
                  title: "Add Collaborated Salons",
                  link: "/addcollaborated",
                  icon: <MdAdd size={20} />,
                  number: 13,
                },
              ],
            },
          ];
          temp_list.push(...salons_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes(
            "salons-category-permission"
          )
        ) {
          let salons_category_permission = [
            {
              type: "dropdown",
              title: "Salons Categories",
              items: [
                {
                  title: "List Top Rated",
                  link: "/topratedsalons",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 110,
                },
                {
                  title: "List Bridal",
                  link: "/listbridal",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 14,
                },
                {
                  title: "Academy Salons",
                  link: "/academysalons",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 15,
                },
                {
                  title: "Makeup",
                  link: "/makeup",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 16,
                },
                {
                  title: "Female Beauty Parlour",
                  link: "/femalebeautyparlour",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 17,
                },
                {
                  title: "Kids Special",
                  link: "/kidsspecial",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 18,
                },
                {
                  title: "Male Salons",
                  link: "/malesalons",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 19,
                },
                {
                  title: "Unisex Salons",
                  link: "/unisexsalons",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 20,
                },
              ],
            },
          ];
          temp_list.push(...salons_category_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes(
            "salon-priority-management-permission"
          )
        ) {
          let salon_priority_management_permission = [
            {
              type: "dropdown",
              title: "Priority Management",
              items: [
                {
                  title: "City and Area Priority",
                  link: "/cityandareapriority",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 22,
                },
              ],
            },
          ];
          temp_list.push(...salon_priority_management_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("master-permission")) {
          let master_permission = [
            {
              type: "dropdown",
              title: "Master",
              items: [
                {
                  title: "Master Services",
                  link: "/masterservices",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 23,
                },
                {
                  title: "Master Services Form",
                  link: "/masterservicesform",
                  icon: <MdAdd size={20} />,
                  number: 24,
                },
                {
                  title: "Master Categories",
                  link: "/mastercategories",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 25,
                },
                {
                  title: "Master Category Form",
                  link: "/mastercategoryform",
                  icon: <MdAdd size={20} />,
                  number: 26,
                },
              ],
            },
          ];
          temp_list.push(...master_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes(
            "master-product-permission"
          )
        ) {
          let prodcut_master_permission = [
            {
              type: "dropdown",
              title: "Master Product",
              items: [
                {
                  title: "Master Product List",
                  link: "/productmasterlist",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 71,
                },
                {
                  title: "Master Product Form",
                  link: "/productmasterservicesfrom",
                  icon: <MdAdd size={20} />,
                  number: 70,
                },
                {
                  title: "Salon Product List",
                  link: "/SalonProductList",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 73,
                },
                {
                  title: "Salon Product From",
                  link: "/SalonProductFrom",
                  icon: <MdAdd size={20} />,
                  number: 72,
                },
              ],
            },
          ];
          temp_list.push(...prodcut_master_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes("category-permission")
        ) {
          let category_permission = [
            {
              type: "dropdown",
              title: "Category",
              items: [
                {
                  title: "List National Categories",
                  link: "/listnationalcategories",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 27,
                },
                {
                  title: "Add National Category",
                  link: "/addnationalcategory",
                  icon: <MdAdd size={20} />,
                  number: 28,
                },
                {
                  title: "List Categories",
                  link: "/listcategories",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 29,
                },
                {
                  title: "Add Category",
                  link: "/addcategory",
                  icon: <MdAdd size={20} />,
                  number: 30,
                },
              ],
            },
          ];
          temp_list.push(...category_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes("service-permission")
        ) {
          let service_permission = [
            {
              type: "dropdown",
              title: "Salon Services",
              items: [
                {
                  title: "List Salon Services",
                  link: "/listofservices",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 31,
                },
                {
                  title: "Add Salon Service",
                  link: "/addservice",
                  icon: <MdAdd size={20} />,
                  number: 32,
                },
                {
                  title: "List Service details",
                  link: "/list-service-details",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 68,
                },
                {
                  title: "Add Service details",
                  link: "/add-service-details",
                  icon: <MdAdd size={20} />,
                  number: 69,
                },
                {
                  title: "List Master Overview",
                  link: "/master-overview-details",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 76,
                },
                {
                  title: "Add Master Overview",
                  link: "/add-master-overview",
                  icon: <MdAdd size={20} />,
                  number: 77,
                },
              ],
            },
          ];
          temp_list.push(...service_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes(
            "national-city-hero-offers-permission"
          )
        ) {
          let national_city_hero_offers_permission = [
            {
              type: "dropdown",
              title: "National/City Hero Offers",
              items: [
                {
                  title: "National/City Hero Offers",
                  link: "/nationalherooffers",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 33,
                },
                {
                  title: "Add National/City Hero Offers",
                  link: "/addnationalherooffers",
                  icon: <MdAdd size={20} />,
                  number: 34,
                },
              ],
            },
          ];
          temp_list.push(...national_city_hero_offers_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes("city-offers-permission")
        ) {
          let city_offers_permission = [
            {
              type: "dropdown",
              title: "City Offers",
              items: [
                {
                  title: "List City/Area Offers",
                  link: "/listoffer",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 35,
                },
                {
                  title: "Add City/Area Offer",
                  link: "/addoffer",
                  icon: <MdAdd size={20} />,
                  number: 36,
                },
                {
                  title: "Primary City Offers",
                  link: "/cityOffers",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 37,
                },
                {
                  title: "Add Primary City Offer",
                  link: "/addcityOffers",
                  icon: <MdAdd size={20} />,
                  number: 38,
                },
              ],
            },
          ];
          temp_list.push(...city_offers_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes(
            "salon-specific-permission"
          )
        ) {
          let salon_specific_permission = [
            {
              type: "dropdown",
              title: "Salon Specific",
              items: [
                {
                  title: "List Salon Profile Offer",
                  link: "/salonprofileoffer",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 39,
                },
                {
                  title: "Add Salon Profile Offer",
                  link: "/addsalonprofileoffer",
                  icon: <MdAdd size={20} />,
                  number: 40,
                },
                {
                  title: "List Offer Tags",
                  link: "/listoffertags",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 41,
                },
                {
                  title: "Add Offer Tags",
                  link: "/addoffertags",
                  icon: <MdAdd size={20} />,
                  number: 42,
                },
                {
                  title: "List Salon Service Packages",
                  link: "/listservicepackages",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 43,
                },
                {
                  title: "Add Salon Service Packages",
                  link: "/addservicepackages",
                  icon: <MdAdd size={20} />,
                  number: 44,
                },
                {
                  title: "List salon main offers",
                  link: "/listmainoffers",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 74,
                },
                {
                  title: "Add salon main offers",
                  link: "/addmainoffers",
                  icon: <MdAdd size={20} />,
                  number: 75,
                },
              ],
            },
          ];
          temp_list.push(...salon_specific_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes(
            "national-specific-permission"
          )
        ) {
          let national_specific_permission = [
            {
              type: "dropdown",
              title: "National Specific",
              items: [
                {
                  title: "List Featured This Week",
                  link: "/featuredthisweek",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 45,
                },
                {
                  title: "Add Featured This Week",
                  link: "/addfeaturedthisweek",
                  icon: <MdAdd size={20} />,
                  number: 46,
                },
                {
                  title: "List National Offer",
                  link: "/listnationaloffer",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 47,
                },
                {
                  title: "Add National Offer",
                  link: "/addnationaloffer",
                  icon: <MdAdd size={20} />,
                  number: 48,
                },
              ],
            },
          ];
          temp_list.push(...national_specific_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes(
            "daily-updates-permission"
          )
        ) {
          let daily_updates_permission = [
            {
              type: "dropdown",
              title: "Daily Updates",
              items: [
                {
                  title: "List Daily Updates",
                  link: "/listdailyupdates",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 49,
                },
                {
                  title: "Add Daily Updates",
                  link: "/adddailyupdates",
                  icon: <MdAdd size={20} />,
                  number: 50,
                },
              ],
            },
          ];
          temp_list.push(...daily_updates_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes(
            "client-work-photos-permission"
          )
        ) {
          let client_work_photos_permission = [
            {
              type: "dropdown",
              title: "Client Work Photos",
              items: [
                {
                  title: "List Client Work",
                  link: "/listclientworkphotos",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 51,
                },
                {
                  title: "Add Client Work Photos",
                  link: "/addclientworkphotos",
                  icon: <MdAdd size={20} />,
                  number: 52,
                },
              ],
            },
          ];
          temp_list.push(...client_work_photos_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes("city-area-permission")
        ) {
          let city_area_permission = [
            {
              type: "dropdown",
              title: "Cities/Areas",
              items: [
                {
                  title: "List Cities",
                  link: "/listcities",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 53,
                },
                {
                  title: "Add City",
                  link: "/addcity",
                  icon: <MdAdd size={20} />,
                  number: 54,
                },
                {
                  title: "List Areas",
                  link: "/listareas",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 55,
                },
                {
                  title: "Add Area",
                  link: "/addarea",
                  icon: <MdAdd size={20} />,
                  number: 56,
                },
              ],
            },
          ];
          temp_list.push(...city_area_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("blogs-permission")) {
          let blogs_permission = [
            {
              type: "dropdown",
              title: "Blogs",
              items: [
                {
                  title: "Blog User Emails",
                  link: "/bloguseremails",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 57,
                },
                {
                  title: "SEO Management",
                  link: "/blogseomanagement",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 58,
                },
                {
                  title: "List Blogs",
                  link: "/listblogs",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 59,
                },
                {
                  title: "Add Blog",
                  link: "/addblogs",
                  icon: <MdAdd size={20} />,
                  number: 60,
                },
                {
                  title: "Blog Categories",
                  link: "/blogcategories",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 61,
                },
                {
                  title: "Add Blog Category",
                  link: "/addblogcategory",
                  icon: <MdAdd size={20} />,
                  number: 62,
                },
              ],
            },
          ];
          temp_list.push(...blogs_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes("pos-request-permission")
        ) {
          let pos_request_permission = [
            {
              type: "dropdown",
              title: "POS Request",
              items: [
                {
                  title: "List category request",
                  link: "/list-category-request",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 63,
                },
                {
                  title: "list service request",
                  link: "/list-service-request",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 64,
                },
                {
                  title: "list Offer request",
                  link: "/list-offer-request",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 64,
                },
                {
                  title: "list Package request",
                  link: "/list-package-request",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 64,
                },
              ],
            },
          ];
          temp_list.push(...pos_request_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("vendor-permission")) {
          let vendor_permission = [
            {
              type: "dropdown",
              title: "Vendors",
              items: [
                {
                  title: "List Vendors",
                  link: "/listvendors",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 63,
                },
                {
                  title: "Add Vendor",
                  link: "/addvendor",
                  icon: <MdAdd size={20} />,
                  number: 64,
                },
              ],
            },
          ];
          temp_list.push(...vendor_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("logs-permission")) {
          let logs_permission = [
            {
              type: "normal",
              title: "Logs",
              link: "/logs",
              number: 65,
            },
          ];
          temp_list.push(...logs_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes(
            "pos-salon-requst-permission"
          )
        ) {
          let pos_salon_requst_permission = [
            {
              type: "normal",
              title: "Pos Salon Request",
              link: "/pos-Salon-request",
              number: 75,
            },
          ];
          temp_list.push(...pos_salon_requst_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("super-permission")) {
          let permissions_permission = [
            {
              type: "dropdown",
              title: "Permissions",
              items: [
                {
                  title: "List Permissions",
                  link: "/permissions-data",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 66,
                },
                {
                  title: "Add Permission",
                  link: "/custompermissions",
                  icon: <MdAdd size={20} />,
                  number: 67,
                },
              ],
            },
          ];
          temp_list.push(...permissions_permission);
        }

        if (
          userPermissions?.data?.[0]?.access?.includes(
            "user-creation-permission"
          )
        ) {
          let user_creation_permission = [
            {
              type: "dropdown",
              title: "User Creation",
              items: [
                {
                  title: "List Users",
                  link: "/listadminuser",
                  icon: <MdFormatListBulleted size={20} />,
                  number: 68,
                },
                {
                  title: "Add User",
                  link: "/createadminuser",
                  icon: <MdAdd size={20} />,
                  number: 69,
                },
              ],
            },
          ];
          temp_list.push(...user_creation_permission);
        }
      }

      setList(temp_list);
      setFilteredList(filterMenuItems(temp_list, searchTerm));
    } else if (userPermissions?.status == 404) {
      let temp_list = [
        {
          type: "normal",
          title: "Dashboard",
          link: "/dashboard",
          link2: "/",
          number: 1,
        },
      ];

     let general_permission = [
  {
    type: "normal",
    title: "Customers",
    link: "/customers",
    number: 2,
  },
  {
    type: "dropdown",
    title: "Salon Scores",
    items: [
      {
        type: "normal",
        title: "Salon Scores",
        icon: <MdFormatListBulleted size={20} />,
        link: "/userreviews",
        number: 4,
      },
      {
        title: "Add Salon Scores",
        link: "/addsalonscores",
        icon: <MdAdd size={20} />,
        number: 5,
      },
    ],
  },
  {
    type: "normal",
    title: "Trakky Ratings",
    link: "/ratings",
    number: 6,
  },
  {
    type: "normal",
    title: "Contact Us",
    link: "/usercontactus",
    number: 8,
  },
  {
    type: "normal",
    title: "Create User",
    link: "/createuser",
    number: 3,
  },
];

      temp_list.push(...general_permission);
      setList(temp_list);
      setFilteredList(filterMenuItems(temp_list, searchTerm));
    } else {
      console.log("error");
    }
  }, [userPermissions, currentMode, location.search]);

  // Update filtered list when search term changes
  useEffect(() => {
    setFilteredList(filterMenuItems(list, searchTerm));
  }, [searchTerm, list]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset selections on search to avoid conflicts
    setSelected(null);
  };

  const handleClose = () => {
    props.change_hamburger_state(!props.hamburger_state);
  };

  // Render items from filtered list
  const renderMenuItems = () => {
    return filteredList.map((item, index) => {
      if (item.type === "normal") {
        return (
          <SidebarItem
            number={item.number}
            link2={item.link2}
            selecetedbtn={selecetedbtn}
            setSelectedbtn={setSelectedbtn}
            title={item.title}
            link={item.link}
            key={index}
            handleClose={handleClose}
            hamburger_state={props.hamburger_state}
            currentMode={currentMode}
            navigateWithMode={navigateWithMode}
          />
        );
      } else {
        return (
          <SidebarDropdown
            icon={item.icon}
            selected={item.autoExpanded ? index : selected}
            setSelected={setSelected}
            selecetedbtn={selecetedbtn}
            setSelectedbtn={setSelectedbtn}
            title={item.title}
            items={item.items}
            key={index}
            index={index}
            handleClose={handleClose}
            hamburger_state={props.hamburger_state}
            currentMode={currentMode}
            navigateWithMode={navigateWithMode}
            autoExpanded={item.autoExpanded}
          />
        );
      }
    });
  };

  return (
    <>
      <div className="relative min-h-screen bg-gray-50 flex flex-col items-center text-base font-sans shadow-md transition-all duration-300 max-h-screen overflow-hidden border-r border-gray-300 w-72 overflow-x-hidden">
        {props.hamburger_state && (
          <div className="absolute top-4 right-4 z-10 cursor-pointer bg-white rounded-md p-1.5 hover:bg-blue-50 transition-colors duration-200 shadow-sm" onClick={handleClose}>
            <MdKeyboardDoubleArrowLeft color="#1E3A8A" size={22} />
          </div>
        )}
        <div className="w-full flex items-center gap-3 p-3 mb-2 border-b border-gray-200 flex-shrink-0 overflow-x-hidden">
          <button
            className="bg-transparent border-none text-blue-700 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center shadow-sm"
            onClick={handleBackToSelectMode}
            title="Back to Mode Selection"
          >
            <MdArrowBack size={20} />
          </button>
          <div className="w-32 overflow-hidden">
            <img src={logo} alt="logo" className="w-full h-auto" />
          </div>
        </div>
        {/* Search Functionality */}
        <div className="w-full px-3 mb-2 flex-shrink-0 overflow-x-hidden">
          <div className="relative flex items-center">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm transition-all duration-200 outline-none shadow-sm"
            />
          </div>
        </div>
        <div className="w-full flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-x-hidden">
          {renderMenuItems()}
        </div>
      </div>
    </>
  );
};

export default New_Sidebar;



const SidebarItem = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    // ADDED: Close sidebar on mobile when item is clicked
    if (props.hamburger_state) {
      props.handleClose();
    }
    props.setSelectedbtn(props.number);

    if (props.currentMode) {
      props.navigateWithMode(props.link);
    } else {
      navigate(props.link);
    }
  };

  const getLinkWithMode = () => {
    if (props.currentMode) {
      return `${props.link}?mode=${props.currentMode}`;
    }
    return props.link;
  };

  const isActive =
    location.pathname === props.link || location.pathname === props.link2;

  return (
    <div className={`w-full cursor-pointer py-3 px-4 border-b border-gray-100 transition-all duration-200 text-sm font-medium text-gray-800 hover:bg-blue-50 ${isActive ? 'bg-blue-50 border-l-4 border-blue-600' : ''} overflow-x-hidden`}>
      {props.currentMode ? (
        <a href={getLinkWithMode()} className="block w-full text-left no-underline text-gray-800 hover:text-blue-700 transition-colors duration-200" onClick={handleClick}>
          <div className="truncate">{props.title}</div>
        </a>
      ) : (
        <Link
          to={props.link}
          className="block w-full text-left no-underline text-gray-800 hover:text-blue-700 transition-colors duration-200"
          onClick={(e) => {
            // ADDED: Close sidebar on mobile when item is clicked
            if (props.hamburger_state) {
              props.handleClose();
            }
            props.setSelectedbtn(props.number);
          }}
        >
          <div className="truncate">{props.title}</div>
        </Link>
      )}
    </div>
  );
};

const SidebarDropdown = (props) => {
  const [showDescription, setShowDescription] = useState(props.autoExpanded || false);

  const handleClick = () => {
    if (props.selected === props.index) {
      props.setSelected(null);
      setShowDescription(false);
    } else {
      setShowDescription(true);
      props.setSelected(props.index);
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div 
        className={`w-full flex justify-between items-center py-3 px-4 cursor-pointer transition-all duration-200 text-sm font-medium text-gray-800 hover:bg-blue-50 ${props.selected === props.index ? 'bg-blue-50 border-l-4 border-blue-600' : ''} overflow-x-hidden`}
        onClick={handleClick}
      >
        <div className="truncate">{props.title}</div>
        <div className="flex items-center">
          {props.selected === props.index ? (
            <MdKeyboardArrowUp color="#1E3A8A" size={20} />
          ) : (
            <MdKeyboardArrowDown color="#1E3A8A" size={20} />
          )}
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${props.selected === props.index && showDescription ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'}`}>
        <div className="bg-gray-100 border-t border-gray-200 overflow-x-hidden">
          {props.items.map((item, key) => {
            return (
              <DropdownItem
                selecetedbtn={props.selecetedbtn}
                setSelectedbtn={props.setSelectedbtn}
                icon={item.icon}
                title={item.title}
                link={item.link}
                key={key}
                selected={props.selected}
                handleClose={props.handleClose}
                hamburger_state={props.hamburger_state}
                index={key}
                number={item.number}
                currentMode={props.currentMode}
                navigateWithMode={props.navigateWithMode}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DropdownItem = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    // ADDED: Close sidebar on mobile when dropdown item is clicked
    if (props.hamburger_state) {
      props.handleClose();
    }
    props.setSelectedbtn(props.number);

    if (props.currentMode) {
      props.navigateWithMode(props.link);
    } else {
      navigate(props.link);
    }
  };

  const getLinkWithMode = () => {
    if (props.currentMode) {
      return `${props.link}?mode=${props.currentMode}`;
    }
    return props.link;
  };

  const isActive = location.pathname === props.link;

  return (
    <div className={`flex items-center gap-3 py-2.5 px-5 transition-all duration-200 text-sm text-gray-700 hover:bg-blue-50 ${isActive ? 'bg-blue-100 border-l-4 border-blue-600' : ''} overflow-x-hidden`}>
      {props.currentMode ? (
        <a href={getLinkWithMode()} className="flex items-center gap-3 w-full text-left no-underline text-gray-700 hover:text-blue-700 transition-colors duration-200" onClick={handleClick}>
          <div className="flex-shrink-0 text-gray-600">{props.icon}</div>
          <div className="truncate flex-1 min-w-0">{props.title}</div>
        </a>
      ) : (
        <Link
          to={props.link}
          className="flex items-center gap-3 w-full text-left no-underline text-gray-700 hover:text-blue-700 transition-colors duration-200"
          onClick={(e) => {
            // ADDED: Close sidebar on mobile when dropdown item is clicked
            if (props.hamburger_state) {
              props.handleClose();
            }
            props.setSelectedbtn(props.number);
          }}
        >
          <div className="flex-shrink-0 text-gray-600">{props.icon}</div>
          <div className="truncate flex-1 min-w-0">{props.title}</div>
        </Link>
      )}
    </div>
  );
};