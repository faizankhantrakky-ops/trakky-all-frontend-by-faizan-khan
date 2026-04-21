import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";

const AddOfferTags = ({ offerTags, closeModal }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [selectedCity, setSelectedCity] = useState(offerTags?.salon_city || "");
  const [city, setCity] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (offerTags) {
      return {
        value: offerTags?.salon,
        label: offerTags?.salon_name,
      };
    }
    return null;
  });
  const [selectSalonId, setSelectSalonId] = useState(offerTags?.salon || "");
  const [finalOfferSelected, setFinalOfferSelected] = useState("");
  const [amount, setAmount] = useState("");
  const [percentage, setPercentage] = useState("");

  const offerFormat = [
    "Get ₹ off",
    "Service at ₹",
    "Get ₹ off on services",
    "Get % off on services",
  ];
  const [offerFormatSelected, setOfferFormatSelected] = useState("");

  // === Parse existing offer tag on edit ===
  useEffect(() => {
    if (offerTags) {
      const parts = offerTags.offer_tag.split(" ");
      if (parts[0] === "Get") {
        if (parts[1].endsWith("%")) {
          setPercentage(parseFloat(parts[1].replace("%", "")));
          setOfferFormatSelected(offerFormat[3]);
        } else if (parts[1].startsWith("₹") && parts[3] === "on") {
          setAmount(parseFloat(parts[1].replace("₹", "")));
          const serviceIndex = parts.indexOf("on") + 1;
          setServiceName(parts.slice(serviceIndex).join(" "));
          setOfferFormatSelected(offerFormat[2]);
        } else if (parts[parts.length - 1] === "off") {
          setAmount(parseFloat(parts[1].replace("₹", "")));
          setOfferFormatSelected(offerFormat[0]);
        }
      } else {
        const amountValue = parseFloat(parts[parts.length - 1].replace("₹", ""));
        setAmount(amountValue);
        setServiceName(parts.slice(0, -2).join(" "));
        setOfferFormatSelected(offerFormat[1]);
      }
    }
  }, [offerTags]);

  // === Format final offer string ===
  const formatOffer = () => {
    if (!offerFormatSelected) return;

    let formatted = offerFormatSelected;

    if (offerFormatSelected.includes("services")) {
      formatted = formatted.replace("services", serviceName);
    }
    if (offerFormatSelected.includes("Service")) {
      formatted = formatted.replace("Service", serviceName);
    }
    if (offerFormatSelected.includes("₹")) {
      formatted = formatted.replace("₹", `₹${amount}`);
    }
    if (offerFormatSelected.includes("%")) {
      formatted = formatted.replace("%", `${percentage}%`);
    }

    setFinalOfferSelected(formatted);
  };

  useEffect(() => {
    formatOffer();
  }, [serviceName, offerFormatSelected, amount, percentage]);

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

  // === Submit Form ===
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectSalonId || !finalOfferSelected) {
      toast.error("Please fill all required fields.", {
        style: { background: "#f97316", color: "#fff" },
      });
      return;
    }

    const formData = new FormData();
    formData.append("salon", selectSalonId);
    formData.append("offer_tag", finalOfferSelected);

    const isUpdate = !!offerTags;
    const url = isUpdate
      ? `https://backendapi.trakky.in/salons/salon-offer-tags/${offerTags.id}/`
      : `https://backendapi.trakky.in/salons/salon-offer-tags/`;

    try {
      const response = await fetch(url, {
        method: isUpdate ? "PATCH" : "POST",
        headers: { Authorization: "Bearer " + authTokens.access },
        body: formData,
      });

      if ((isUpdate && response.status === 200) || (!isUpdate && response.status === 201)) {
        toast.success(isUpdate ? "Updated successfully" : "Added successfully", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });

        if (!isUpdate) {
          setSelectedSalons(null);
          setSelectedCity("");
          setOfferFormatSelected("");
          setServiceName("");
          setAmount("");
          setPercentage("");
          setFinalOfferSelected("");
        }
        closeModal();
      } else if (response.status === 409) {
        toast.error("Error: Salon already has an offer tag.", {
          style: { background: "#ef4444", color: "#fff" },
        });
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Error: ${response.status} - ${response.statusText}`, {
          style: { background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      toast.error("Failed to process. Please try again.", {
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
              {offerTags ? "Update" : "Add"} Offer Tag
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {offerTags ? "Modify existing offer tag" : "Create a new salon offer tag"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-7">
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
                  setSelectedCity(e.target.value);
                }}
                disabled={!!offerTags}
                required={!offerTags}
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
                <span className="text-xs text-gray-500 ml-2">
                  Must belong to selected city
                </span>
              </label>
              <AsyncSelect
                isDisabled={!selectedCity || !!offerTags}
                cacheOptions
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(opt) => {
                  setSelectedSalons(opt);
                  setSelectSalonId(opt?.value || "");
                  setOfferFormatSelected("");
                  setAmount("");
                  setPercentage("");
                  setServiceName("");
                }}
                placeholder="Search salon..."
                noOptionsMessage={() => (!selectedCity ? "Select city first" : "No salons found")}
                className="text-sm"
                styles={selectStyles}
              />
            </div>

            {/* Offer Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Offer Format <span className="text-red-500">*</span>
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
                {offerFormat.map((fmt) => (
                  <option key={fmt} value={fmt}>{fmt}</option>
                ))}
              </select>
            </div>

            {/* Service Name */}
            {(offerFormatSelected === "Service at ₹" ||
              offerFormatSelected === "Get ₹ off on services" ||
              offerFormatSelected === "Get % off on services") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g., Haircut, Facial"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            )}

            {/* Amount */}
            {(offerFormatSelected === "Get ₹ off" ||
              offerFormatSelected === "Service at ₹" ||
              offerFormatSelected === "Get ₹ off on services") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) => ["ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            )}

            {/* Percentage */}
            {offerFormatSelected === "Get % off on services" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Percentage (%)
                </label>
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="20"
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) => ["ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            )}

            {/* Final Offer Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Offer Tag
              </label>
              <input
                type="text"
                value={finalOfferSelected}
                disabled
                placeholder="Offer will appear here..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-6 gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              >
                {offerTags ? "Update Tag" : "Create Tag"}
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

export default AddOfferTags;