import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast from "react-hot-toast";
import AsyncSelect from "react-select/async";

const AddCategory = ({ CategoryData, setCategoryData }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [slug, setSlug] = useState(CategoryData?.slug || "");
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(
    CategoryData?.city
      ? CategoryData.city.charAt(0).toUpperCase() +
          CategoryData.city.slice(1).toLowerCase()
      : ""
  );
  const [city, setCity] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState(
    CategoryData?.master_category_id || ""
  );
  const [categoryName, setCategoryName] = useState(
    CategoryData?.category_name || ""
  );
  const [gender, setGender] = useState("");
  const [selectCategoryValue, setSelectCategoryValue] = useState("");
  const [selectedSalonIds, setSelectedSalons] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === Load cities & categories on mount ===
  useEffect(() => {
    getCity();
    getCategories();
  }, []);

  // === Auto-generate slug on add (not edit) ===
  useEffect(() => {
    if (!CategoryData && categoryName && gender) {
      const temp = `${categoryName}-${gender}`;
      setSlug(temp.replace(/\s+/g, "-").toLowerCase());
    }
  }, [categoryName, gender, CategoryData]);

  // === Populate edit data ===
  useEffect(() => {
    if (CategoryData) {
      const salonDatas = Object.keys(CategoryData?.salon_names || {}).map(
        (key) => ({
          value: key,
          label: CategoryData.salon_names[key],
        })
      );
      setSelectedSalons(salonDatas);

      // Set category details for edit
      const cat = categoryList.find(
        (c) => c.id === CategoryData.master_category_id
      );
      if (cat) {
        setCategoryId(cat.id);
        setCategoryName(cat.name);
        setGender(cat.gender);
        setSelectCategoryValue(`${cat.id}|${cat.name}|${cat.gender}`);
      } else {
        // Fallback if category not found yet
        setSelectCategoryValue(
          `${CategoryData.master_category_id}|${CategoryData.category_name}|`
        );
      }
    }
  }, [CategoryData, categoryList]);

  // === Fetch Cities ===
  const getCity = async () => {
    try {
      const res = await fetch("https://backendapi.trakky.in/salons/city/");
      if (!res.ok) throw new Error("Failed to fetch cities");
      const data = await res.json();
      setCityPayload(data?.payload || []);
      const cityNames =
        data?.payload?.map(
          (item) =>
            item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()
        ) || [];
      setCity(cityNames);
    } catch (err) {
      toast.error("Failed to load cities.", {
        style: {
          borderRadius: "10px",
          background: "#ef4444",
          color: "#fff",
        },
      });
    }
  };

  // === Fetch Master Categories ===
  const getCategories = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/mastercategory/",
        {
          headers: {
            Authorization: "Bearer " + authTokens.access,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setCategoryList(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired.", {
          style: {
            borderRadius: "10px",
            background: "#ef4444",
            color: "#fff",
          },
        });
      } else {
        throw new Error(`Error ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to load master categories.", {
        style: {
          borderRadius: "10px",
          background: "#ef4444",
          color: "#fff",
        },
      });
    }
  };

  // === Async Load Salons (Updated with Salon Name - Area format) ===
  const loadSalons = async (inputValue, callback) => {
    if (!selectedCity) {
      callback([]);
      return;
    }
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
          inputValue
        )}&city=${selectedCity}`
      );
      const data = await response.json();
      const options = (data?.results || []).map((salon) => ({
        value: salon.id,
        label: `${salon.name} - ${salon.area}`, // Changed to include area
        originalName: salon.name,
        area: salon.area,
      }));
      callback(options);
    } catch (error) {
      console.error("Error fetching salons:", error);
      callback([]);
    }
  };

  // === Handle Submit ===
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedCity) {
      toast.error("Please select a city.", {
        style: {
          borderRadius: "10px",
          background: "#ef4444",
          color: "#fff",
        },
      });
      return;
    }
    if (!categoryId) {
      toast.error("Please select a master category.", {
        style: {
          borderRadius: "10px",
          background: "#ef4444",
          color: "#fff",
        },
      });
      return;
    }
    if (selectedSalonIds.length === 0) {
      toast.error("Please select at least one salon.", {
        style: {
          borderRadius: "10px",
          background: "#ef4444",
          color: "#fff",
        },
      });
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("master_category_id", categoryId);
    formData.append("city", selectedCity);
    selectedSalonIds.forEach((salon) => formData.append("salon", salon.value));
    try {
      const url =
        CategoryData && CategoryData.id
          ? `https://backendapi.trakky.in/salons/category/${CategoryData.id}/`
          : `https://backendapi.trakky.in/salons/category/`;

      const method = CategoryData && CategoryData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: "Bearer " + authTokens.access,
        },
        body: formData,
      });
      const result = await response.json();
      if (response.status === 200 || response.status === 201) {
        toast.success(
          CategoryData
            ? "Category updated successfully!"
            : "Category added successfully!",
          {
            style: {
              borderRadius: "10px",
              background: "#22c55e",
              color: "#fff",
            },
          }
        );
        if (!CategoryData) {
          setSelectedCity("");
          setSelectedSalons([]);
          setCategoryId("");
          setCategoryName("");
          setGender("");
          setSelectCategoryValue("");
          setSlug("");
        }
        if (setCategoryData) {
          setCategoryData(result);
        }
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired.", {
          style: {
            borderRadius: "10px",
            background: "#ef4444",
            color: "#fff",
          },
        });
      } else if (response.status === 409) {
        toast.error(result?.error || "Conflict occurred.", {
          style: {
            borderRadius: "10px",
            background: "#ef4444",
            color: "#fff",
          },
        });
      } else {
        toast.error(`Error: ${response.status}`, {
          style: {
            borderRadius: "10px",
            background: "#ef4444",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error("Submission failed.", {
        style: {
          borderRadius: "10px",
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm m-3">
      {/* === HEADER === */}
      <div className="px-5 py-5 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">
          {CategoryData ? "Update Category" : "Add New Category"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {CategoryData
            ? "Modify category details"
            : "Create a new salon category for a city"}
        </p>
      </div>
      {/* === FORM BODY === */}
      <form onSubmit={handleSubmit} className="p-3 space-y-5">
        {/* City Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
            <span className="block text-xs text-gray-500 mt-1">
              City is required to add category
            </span>
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!!CategoryData}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:bg-gray-50"
            required
          >
            <option value="">Select City</option>
            {city.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {/* Master Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Master Category <span className="text-red-500">*</span>
            <span className="block text-xs text-gray-500 mt-1">
              Ensure it's not already added in this city
            </span>
          </label>
          <select
            value={selectCategoryValue}
            onChange={(e) => {
              const [id, name, gend] = e.target.value.split("|");
              setCategoryId(id);
              setCategoryName(name);
              setGender(gend);
              setSelectCategoryValue(e.target.value);
            }}
            disabled={!!CategoryData}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:bg-gray-50"
            required
          >
            <option value="" disabled>
              --- Select Category ---
            </option>
            {categoryList.map((cat) => (
              <option
                key={cat.id}
                value={`${cat.id}|${cat.name}|${cat.gender}`}
                disabled={cat.id === CategoryData?.master_category_id}
              >
                {cat.name} ({cat.gender})
              </option>
            ))}
          </select>
        </div>
        {/* Async Salon Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Salons <span className="text-red-500">*</span>
          </label>
          <AsyncSelect
            isMulti
            cacheOptions
            defaultOptions
            loadOptions={loadSalons}
            value={selectedSalonIds}
            onChange={setSelectedSalons}
            placeholder="Search salons by name..."
            noOptionsMessage={() =>
              selectedCity ? "No salons found" : "Select a city first"
            }
            loadingMessage={() => "Searching salons..."}
            className="text-sm"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#d1d5db",
                borderRadius: "0.5rem",
                padding: "0.125rem",
                "&:hover": {
                  borderColor: "#9ca3af",
                },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#dbeafe",
                borderRadius: "0.375rem",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "#1e40af",
              }),
            }}
            formatOptionLabel={(option, { context }) => (
              <div>
                {context === "menu" ? (
                  <div className="flex flex-col">
                    <span className="font-medium">{option.originalName}</span>
                    <span className="text-xs text-gray-500">
                      Area: {option.area}
                    </span>
                  </div>
                ) : (
                  <span>{option.label}</span>
                )}
              </div>
            )}
          />
        </div>
        {/* Slug Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-on-add"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            required
          />
        </div>
        {/* Submit Button */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                {CategoryData ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>{CategoryData ? "Update Category" : "Add Category"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
