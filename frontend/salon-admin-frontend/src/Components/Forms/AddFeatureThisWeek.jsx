import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";

const AddFeatureThisWeek = ({ featured, closeModal }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [selectedCity, setSelectedCity] = useState(featured?.salon_city || "");
  const [city, setCity] = useState([]);
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (featured) {
      return { value: featured.salon, label: featured.salon_name };
    }
    return null;
  });
  const [selectSalonId, setSelectSalonId] = useState(featured?.salon || "");
  const [offerFormatSelected, setOfferFormatSelected] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [percentage, setPercentage] = useState("");
  const [finalOfferSelected, setFinalOfferSelected] = useState("");

  const offerFormat = [
    "Get Rs off",
    "Service at Rs",
    "Get Rs off on services",
    "Get % off on services",
  ];

  // === Load Cities ===
  const getCity = async () => {
    try {
      const url = `https://backendapi.trakky.in/salons/city/`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const cityNames = data?.payload?.map((item) => item.name) || [];
      setCity(cityNames);
    } catch (err) {
      toast.error("Failed to load cities", {
        style: { background: "#ef4444", color: "#fff" },
      });
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  // === Load Salons (Updated with Salon Name - Area format) ===
  const loadSalons = async (inputValue, callback) => {
    if (!inputValue || !selectedCity) return callback([]);
    try {
      const url = `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(inputValue)}&city=${selectedCity}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const options = data?.results?.map((s) => ({
        value: s.id,
        label: `${s.name} - ${s.area}`, // Changed to include area
        originalName: s.name,
        area: s.area
      })) || [];
      callback(options);
    } catch (err) {
      console.error(err);
      callback([]);
    }
  };

  // === Auto-generate Final Offer ===
  const formatOffer = () => {
    if (!offerFormatSelected) {
      setFinalOfferSelected("");
      return;
    }

    let offer = offerFormatSelected;

    if (offerFormatSelected === "Get Rs off on services") {
      offer = offer.replace("services", serviceName || "services");
      offer = offer.replace("Rs", `Rs${amount || ""}`);
    } else if (offerFormatSelected === "Service at Rs") {
      offer = offer.replace("Service", serviceName || "Service");
      offer += ` ${amount || ""}`;
    } else if (offerFormatSelected === "Get Rs off") {
      offer = offer.replace("Rs", `Rs${amount || ""}`);
    } else if (offerFormatSelected === "Get % off on services") {
      offer = offer.replace("services", serviceName || "services");
      offer = offer.replace("%", `${percentage || ""}%`);
    }

    setFinalOfferSelected(offer);
  };

  useEffect(() => {
    formatOffer();
  }, [offerFormatSelected, serviceName, amount, percentage]);

  // === Handle Submit ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for service-based offers
    if (
      (offerFormatSelected === "Get Rs off on services" ||
        offerFormatSelected === "Get % off on services") &&
      !serviceName
    ) {
      toast.error("Select Service!!", {
        style: { background: "#ef4444", color: "#fff" },
      });
      return;
    }

    const formData = new FormData();
    formData.append("salon", selectSalonId);
    formData.append("custom_offer_tag", finalOfferSelected);

    const isEdit = !!featured;
    const url = isEdit
      ? `https://backendapi.trakky.in/salons/feature-this-week/${featured.id}/`
      : `https://backendapi.trakky.in/salons/feature-this-week/`;

    try {
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
      });

      if (res.ok) {
        toast.success(isEdit ? "Updated successfully" : "Added successfully", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });

        if (!isEdit) {
          setSelectedSalons(null);
          setOfferFormatSelected("");
          setServiceName("");
          setAmount("");
          setPercentage("");
          setFinalOfferSelected("");
        }
        closeModal();
      } else if (res.status === 401) {
        toast.error("You're logged out", { style: { background: "#ef4444", color: "#fff" } });
        logoutUser();
      } else {
        const text = await res.text();
        toast.error(`Error: ${res.status} - ${res.statusText}`, {
          style: { background: "#ef4444", color: "#fff" },
        });
      }
    } catch (err) {
      toast.error("Failed to save. Please try again later.", {
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
              {featured ? "Update" : "Add"} Featured Salon
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {featured ? "Modify featured salon offer" : "Highlight a salon this week"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-7">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedSalons(null);
                  setSelectSalonId("");
                  setAmount("");
                  setPercentage("");
                }}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
                Salon <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">Must belong to selected city</span>
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(opt) => {
                  setSelectedSalons(opt);
                  setSelectSalonId(opt?.value || "");
                  setAmount("");
                  setPercentage("");
                }}
                placeholder="Search salon..."
                isDisabled={!selectedCity}
                noOptionsMessage={() => (!selectedCity ? "Select city first" : "No salons found")}
                className="text-sm"
                styles={selectStyles}
                formatOptionLabel={(option, { context }) => (
                  <div>
                    {context === "menu" ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{option.originalName}</span>
                        <span className="text-xs text-gray-500">Area: {option.area}</span>
                      </div>
                    ) : (
                      <span>{option.label}</span>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Offer Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Offer Format <span className="text-red-500">*</span>
              </label>
              <select
                value={offerFormatSelected}
                onChange={(e) => {
                  setOfferFormatSelected(e.target.value);
                  setAmount("");
                  setPercentage("");
                  setServiceName("");
                }}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Select Format</option>
                {offerFormat.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Service Name (Conditional) */}
            {(offerFormatSelected === "Service at Rs" ||
              offerFormatSelected === "Get Rs off on services" ||
              offerFormatSelected === "Get % off on services") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g., Haircut, Spa"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            )}

            {/* Amount (Conditional) */}
            {(offerFormatSelected === "Get Rs off" ||
              offerFormatSelected === "Service at Rs" ||
              offerFormatSelected === "Get Rs off on services") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                  }}
                  placeholder="0"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            )}

            {/* Percentage (Conditional) */}
            {offerFormatSelected === "Get % off on services" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Percentage (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                  }}
                  placeholder="0"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            )}

            {/* Final Offer Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Offer (Auto-generated)
              </label>
              <input
                type="text"
                value={finalOfferSelected}
                disabled
                placeholder="Offer will appear here..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                {featured ? "Update Feature" : "Add Feature"}
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

export default AddFeatureThisWeek;  