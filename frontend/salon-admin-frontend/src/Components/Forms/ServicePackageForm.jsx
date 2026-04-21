import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";

const PackageForm = ({ packages, setPackages, closeMOdal }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [actualPrice, setActualPrice] = useState(packages?.actual_price || 0);
  const [discountedPrice, setDiscountedPrice] = useState(packages?.discount_price || "");
  const [packageName, setPackageName] = useState(packages?.package_name || "");
  const [customServices, setCustomServices] = useState(() => {
    if (packages?.custom_service_field) {
      try {
        return JSON.parse(packages.custom_service_field);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [newService, setNewService] = useState("");
  const [selectedServices, setSelectedServices] = useState(() => {
    if (packages?.service_included) {
      return packages.service_included.map((s) => ({
        value: s,
        label: s.service_name,
      }));
    }
    return [];
  });
  const [packageTime, setPackageTime] = useState(
    packages?.package_time || { days: null, hours: null, minutes: null, seating: null }
  );
  const [selectedCity, setSelectedCity] = useState(packages?.service_included?.[0]?.city || "");
  const [city, setCity] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (packages) {
      return { value: packages.salon, label: packages.salon_name };
    }
    return null;
  });
  const [selectSalonId, setSelectSalonId] = useState(packages?.salon || "");

  // === Load Cities ===
  const getCity = async () => {
    try {
      const url = `https://backendapi.trakky.in/salons/city/`;
      const res = await fetch(url);
      const data = await res.json();
      const cities = data?.payload?.map((item) => item.name) || [];
      setCity(cities);
    } catch (err) {
      toast.error("Failed to load cities.", {
        style: { background: "#ef4444", color: "#fff" },
      });
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  // === Load Salons ===
  const loadSalons = async (inputValue, callback) => {
    if (!inputValue || !selectedCity) {
      callback([]);
      return;
    }
    try {
      const url = `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(inputValue)}&city=${selectedCity}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const options = data?.results?.map((salon) => ({
        value: salon.id,
        label: salon.name,
      })) || [];
      callback(options);
    } catch (error) {
      console.error("Error fetching salons:", error);
      callback([]);
    }
  };

  // === Load Services ===
  const getServices = async (salonId) => {
    if (!salonId) return;
    try {
      const url = `https://backendapi.trakky.in/salons/service/?salon_id=${salonId}`;
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + authTokens.access,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setServicesData(data?.results || []);
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Error: ${response.status} - ${response.statusText}`, {
          style: { background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      toast.error("Error occurred while fetching master services", {
        style: { background: "#ef4444", color: "#fff" },
      });
    }
  };

  useEffect(() => {
    if (selectSalonId) getServices(selectSalonId);
  }, [selectSalonId]);

  // === Auto-calculate actual price ===
  useEffect(() => {
    const total = selectedServices.reduce((sum, s) => sum + s.value.price, 0);
    setActualPrice(total);
  }, [selectedServices]);

  // === Custom Services ===
  const addCustomService = () => {
    if (!newService.trim()) {
      toast.error("Service name cannot be empty", {
        style: { background: "#ef4444", color: "#fff" },
      });
      return;
    }
    setCustomServices((prev) => [...prev, newService.trim()]);
    setNewService("");
  };

  const removeCustomService = (index) => {
    setCustomServices((prev) => prev.filter((_, i) => i !== index));
  };

  // === Submit Form ===
  const handleSubmit = async (event) => {
    event.preventDefault();

    const hasTime = packageTime.days || packageTime.hours || packageTime.minutes || packageTime.seating;
    if (!hasTime) {
      toast.error("At least one option in service time is required", {
        style: { background: "#ef4444", color: "#fff" },
      });
      return;
    }

    const formData = new FormData();
    formData.append("package_name", packageName);
    formData.append("salon", selectSalonId);
    formData.append("discount_price", discountedPrice);
    formData.append(
      "package_time",
      JSON.stringify({
        days: packageTime.days || 0,
        hours: packageTime.hours || 0,
        minutes: packageTime.minutes || 0,
        seating: packageTime.seating || 0,
      })
    );
    formData.append("custom_service_field", JSON.stringify(customServices));

    const isUpdate = !!packages;
    const url = isUpdate
      ? `https://backendapi.trakky.in/salons/packages/${packages.id}/`
      : `https://backendapi.trakky.in/salons/packages/`;

    try {
      const response = await fetch(url, {
        method: isUpdate ? "PATCH" : "POST",
        headers: { Authorization: "Bearer " + authTokens.access },
        body: formData,
      });

      if ((isUpdate && response.status === 200) || (!isUpdate && response.status === 201)) {
        toast.success(isUpdate ? "Package Updated Successfully !!" : "Package added successfully", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });

        if (!isUpdate) {
          setPackageName("");
          setDiscountedPrice("");
          setActualPrice(0);
          setSelectedServices([]);
          setCustomServices([]);
          setSelectedSalons(null);
          setSelectSalonId("");
          setSelectedCity("");
          setPackageTime({ days: null, hours: null, minutes: null, seating: null });
        }
        closeMOdal();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Error: ${response.status} - ${response.statusText}`, {
          style: { background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      toast.error("Failed to process package. Please try again later.", {
        style: { background: "#ef4444", color: "#fff" },
      });
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="mx-auto p-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              {packages ? "Update" : "Add"} Service Package
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {packages ? "Modify existing package" : "Create a new service package"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-7">
            {/* Package Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="e.g., Premium Spa Package"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select City <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedSalons(null);
                  setSelectSalonId("");
                  setSelectedServices([]);
                  setServicesData([]);
                  setActualPrice(0);
                  setCustomServices([]);
                  setSelectedCity(e.target.value);
                }}
                disabled={!!packages}
                required={!packages}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Select City</option>
                {city.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Salon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Salon <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">Must belong to selected city</span>
              </label>
              <AsyncSelect
                isDisabled={!selectedCity || !!packages}
                cacheOptions
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(opt) => {
                  setSelectedSalons(opt);
                  setSelectSalonId(opt?.value || "");
                  setSelectedServices([]);
                }}
                placeholder="Search salon..."
                noOptionsMessage={() => (!selectedCity ? "Select city first" : "No salons found")}
                className="text-sm"
                styles={selectStyles}
              />
            </div>

            {/* Custom Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Services
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomService())}
                  placeholder="e.g., Head Massage"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomService}
                  className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                  Add
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {customServices.map((service, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {service}
                    <button
                      type="button"
                      onClick={() => removeCustomService(i)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Discounted Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discounted Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                placeholder="2999"
                required
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => ["ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Actual Price (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Price (Auto-calculated)
              </label>
              <input
                type="text"
                value={`₹${actualPrice}`}
                disabled
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Package Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Package Duration <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">At least one field required</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Days</label>
                  <input
                    type="number"
                    value={packageTime.days || ""}
                    onChange={(e) => setPackageTime({ ...packageTime, days: e.target.value })}
                    placeholder="0"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Hours</label>
                  <input
                    type="number"
                    value={packageTime.hours || ""}
                    onChange={(e) => setPackageTime({ ...packageTime, hours: e.target.value })}
                    placeholder="2"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Minutes</label>
                  <input
                    type="number"
                    value={packageTime.minutes || ""}
                    onChange={(e) => setPackageTime({ ...packageTime, minutes: e.target.value })}
                    placeholder="30"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Seating</label>
                  <input
                    type="number"
                    value={packageTime.seating || ""}
                    onChange={(e) => setPackageTime({ ...packageTime, seating: e.target.value })}
                    placeholder="1"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-6 gap-3">
              <button
                type="button"
                onClick={closeMOdal}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              >
                {packages ? "Update Package" : "Create Package"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const selectStyles = {
  control: (base) => ({
    ...base,
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    padding: "0.125rem",
    fontSize: "0.875rem",
    boxShadow: "none",
    "&:hover": { borderColor: "#6366f1" },
  }),
  menu: (base) => ({ ...base, zIndex: 9999 }),
};

export default PackageForm;