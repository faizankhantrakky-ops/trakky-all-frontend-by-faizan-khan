import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import AsyncSelect from "react-select/async";
import toast from "react-hot-toast";

const SalonProductForm = ({
  salonProductDataList,
  setSalonProductDataList,
  closeModal,
}) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState(salonProductDataList?.salon_city || "");
  const [masterProductId, setMasterProductId] = useState(salonProductDataList?.masterproduct || "");
  const [selectedSalonId, setSelectedSalonId] = useState(
    salonProductDataList
      ? { value: salonProductDataList.salon, label: salonProductDataList.salon_name }
      : null
  );
  const [salonProductData, setSalonProductData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (salonProductDataList) {
      setSelectedCity(salonProductDataList.salon_city);
      setMasterProductId(salonProductDataList.masterproduct);
      setSelectedSalonId({
        value: salonProductDataList.salon,
        label: salonProductDataList.salon_name,
      });
    }
  }, [salonProductDataList]);

  const getCity = async () => {
    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/city/`);
      const data = await response.json();
      const cityNames = data?.payload?.map((item) => item.name) || [];
      setCity(cityNames);
    } catch (err) {
      toast.error("Failed to load cities");
    }
  };

  const loadSalons = async (inputValue, callback) => {
    if (!inputValue || !selectedCity) {
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
      })) || [];

      callback(options);
    } catch (error) {
      console.error("Error loading salons:", error);
      callback([]);
    }
  };

  const getMasterProduct = async () => {
    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/masterproducts/`, {
        headers: {
          Authorization: "Bearer " + authTokens.access,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSalonProductData(data?.results || []);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to fetch master products");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSalonId?.value || !masterProductId) {
      toast.error("Please select both salon and product.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
      return;
    }

    setIsSubmitting(true);
    const formData = {
      salon: selectedSalonId.value,
      masterproduct: Number(masterProductId),
    };

    try {
      let response;
      if (salonProductDataList) {
        response = await fetch(
          `https://backendapi.trakky.in/salons/productofsalon/${salonProductDataList.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens.access}`,
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        response = await fetch("https://backendapi.trakky.in/salons/productofsalon/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify(formData),
        });
      }

      const result = await response.json();

      if (response.ok) {
        toast.success(
          salonProductDataList
            ? "Product updated successfully!"
            : "Product added successfully!",
          {
            style: { borderRadius: "10px", background: "#22c55e", color: "#fff" },
          }
        );

        if (setSalonProductDataList) {
          setSalonProductDataList(result);
        }

        // ONLY reset product — keep city & salon for next entry
        setMasterProductId("");

        if (closeModal) closeModal();
      } else if (response.status === 409) {
        toast.error(result?.detail || "This product already exists for the salon.", {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired. Please log in again.", {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      } else {
        toast.error(result?.detail || "Something went wrong.", {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please try again.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getMasterProduct();
    getCity();
  }, []);

  // Custom styles for AsyncSelect
  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#d1d5db",
      borderRadius: "0.5rem",
      padding: "0.25rem 0",
      boxShadow: "none",
      "&:hover": { borderColor: "#9ca3af" },
      "&:focus-within": { borderColor: "#3b82f6", ring: "2px solid #3b82f6" },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      marginTop: "0.25rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "#2563eb"
        : isFocused
        ? "#dbeafe"
        : "white",
      color: isSelected ? "white" : "#1f2937",
    }),
  };

  return (
    <div className="bg-white rounded-lg shadow-sm m-3">
      {/* === HEADER === */}
      <div className="px-5 py-5 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">
          {salonProductDataList ? "Edit Salon Product" : "Add Salon Product"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Link a master product to a salon
        </p>
      </div>

      {/* === FORM BODY === */}
      <form onSubmit={handleSubmit} className="p-3 space-y-5 m-3">
        {/* City Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select City <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedSalonId(null);
              setMasterProductId("");
            }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            required
          >
            <option value="">Choose a city...</option>
            {city.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Salon Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Salon <span className="text-red-500">*</span>
            <span className="block text-xs text-gray-500 mt-1">
              Must belong to selected city
            </span>
          </label>
          <AsyncSelect
            cacheOptions
            loadOptions={loadSalons}
            defaultOptions
            value={selectedSalonId}
            onChange={(option) => setSelectedSalonId(option)}
            isDisabled={!selectedCity}
            placeholder="Type salon name..."
            noOptionsMessage={() =>
              selectedCity ? "No salons found" : "Select a city first"
            }
            loadingMessage={() => "Searching..."}
            styles={customStyles}
            className="text-sm"
            required
          />
        </div>

        {/* Master Product */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Master Product <span className="text-red-500">*</span>
          </label>
          <select
            value={masterProductId}
            onChange={(e) => setMasterProductId(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            required
          >
            <option value="">--- Select Product ---</option>
            {salonProductData.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
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
                {salonProductDataList ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>{salonProductDataList ? "Update Product" : "Add Product"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalonProductForm;