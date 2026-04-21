import React from "react";
import {
  MapPin,
  Scissors,
  Building2,
  MapPinned,
  CheckCircle2,
  Phone,
  Star,
  Headphones,
  Gift,
  ArrowRight,
  Users,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import trakkypurple from "../../../Assets/images/logos/Trakky logo purple.png";
import AuthContext from "../../../context/Auth";

const styles = {
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  backgroundImage: "none",
  border: "none",
};

function WhatsappForm() {
  const { user, authTokens, userData } = React.useContext(AuthContext);
  const [selectedGender, setSelectedGender] = React.useState("male");
  const [City, setCity] = React.useState([]);
  const [area, setarea] = React.useState([]);
  const [CategoriesData, setCategoriesData] = React.useState([]);
  const [formData, setFormData] = React.useState({
    city: null,
    area: null,
  });

  const [whatsappData, setWhatsappData] = React.useState({
    city: "",
    area: "",
    salon_service: "",
    other_service: "",
    other_city: "",
    other_area: "",
  });

  // Getting Category Data
  React.useEffect(() => {
    const getCategories = () => {
      const requestOption = {
        method: "GET",
        header: {
          "Content-Type": "application/json",
        },
      };
      fetch(
        `https://backendapi.trakky.in/salons/mastercategory/?gender=${selectedGender}`,
        requestOption,
      )
        .then((res) => res.json())
        .then((data) => {
          setCategoriesData(data);
        })
        .catch((err) => console.log(err));
    };
    getCategories();
  }, [selectedGender]);

  const getcity = async () => {
    const response = await fetch("https://backendapi.trakky.in/salons/city/");
    const data = await response.json();
    setCity(data.payload);
  };

  const getArea = () => {
    if (formData.city === null || formData.city === "Other") {
      return;
    }
    const data = City.filter((item) => {
      return item.id === parseInt(formData.city);
    });
    setarea(data[0].area_names);
  };

  React.useEffect(() => {
    getArea();
  }, [formData.city]);

  React.useEffect(() => {
    getcity();
  }, []);

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleServiceChange = (event) => {
    setWhatsappData({ ...whatsappData, salon_service: event.target.value });
  };

  const handleWhatsAppChat = () => {
    const { name, phone_number, email } = userData;
    const { salon_service, city, area, other_city, other_area, other_service } =
      whatsappData;

    // Handle "Other" cases
    const updatedData = { ...whatsappData };
    if (city === "Other" && other_city) {
      updatedData.city = other_city;
      delete updatedData.other_city;
    }

    if (area === "Other" && other_area) {
      updatedData.area = other_area;
      delete updatedData.other_area;
    }

    if (salon_service === "Other" && other_service) {
      updatedData.salon_service = other_service;
      delete updatedData.other_service;
    }

    // Validate mandatory fields
    if (!salon_service || !city || !area) {
      alert("Please select service, city, and area");
      return;
    }

    const whatsappMessage = `Can I get information about the salon for ${updatedData.salon_service} in ${updatedData.area}, ${updatedData.city}?\n\nGender: ${selectedGender}\n\n`;

    let whatsappURL = `https://api.whatsapp.com/send?phone=916355167304&text=${encodeURIComponent(
      whatsappMessage,
    )}`;

    // Append user data if available
    if (name && phone_number) {
      const userDataString = `Name: ${name}\nPhone Number: ${phone_number}\nEmail: ${email}`;
      whatsappURL += `%0A%0A${encodeURIComponent(userDataString)}`;
    }

    // Open the WhatsApp chat in a new tab/window
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3">
      <div className="w-full  mx-auto">
        {/* Main Form Card */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleWhatsAppChat();
          }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"
          style={{ border: "1px solid #502DA615" }}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Form Fields */}
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold" style={{ color: "#502DA6" }}>
                  Book Your Grooming Session
                </h2>
              </div>
              <p className="text-gray-500 text-sm mb-8">
                Fill in the details to get exclusive offers
              </p>

              {/* Gender Selection */}
              <div className="mb-6">
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "#502DA6" }}
                >
                  <Users size={16} className="inline mr-2" />
                  Select Gender
                </label>
                <div className="flex gap-3">
                  <label
                    htmlFor="male"
                    className={`flex-1 cursor-pointer transition-all duration-200 rounded-xl px-4 py-3 font-medium flex items-center justify-center gap-2 ${
                      selectedGender === "male"
                        ? "text-white shadow-md"
                        : "text-gray-600 hover:shadow-sm"
                    }`}
                    style={{
                      backgroundColor:
                        selectedGender === "male" ? "#502DA6" : "#F3F4F6",
                    }}
                  >
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5dYdjcK8Z8ExSa5H0RSJNPF4hpoiUGhhIMw&s"
                      alt="male"
                      className="w-5 h-5 object-contain"
                    />

                    <span>Male</span>

                    <input
                      type="radio"
                      name="gender"
                      id="male"
                      className="hidden"
                      value="male"
                      onChange={handleGenderChange}
                      checked={selectedGender === "male"}
                      required
                    />
                  </label>
                  <label
                    htmlFor="female"
                    className={`flex-1 cursor-pointer transition-all duration-200 rounded-xl px-4 py-3 font-medium flex items-center justify-center gap-2 ${
                      selectedGender === "female"
                        ? "text-white shadow-md"
                        : "text-gray-600 hover:shadow-sm"
                    }`}
                    style={{
                      backgroundColor:
                        selectedGender === "female" ? "#502DA6" : "#F3F4F6",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/7935/7935713.png"
                      alt="female"
                      className="w-5 h-5 object-contain"
                    />

                    <span>Female</span>

                    <input
                      type="radio"
                      name="gender"
                      id="female"
                      className="hidden"
                      value="female"
                      onChange={handleGenderChange}
                      checked={selectedGender === "female"}
                      required
                    />
                  </label>
                </div>
              </div>

              {/* Salon Service */}
              <div className="mb-5">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#502DA6" }}
                >
                  <Scissors size={16} className="inline mr-2" />
                  Salon Service
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderColor: "#502DA630",
                  }}
                  name="salon_service"
                  onChange={handleServiceChange}
                  required
                >
                  <option value="" disabled selected hidden>
                    Select Salon Service
                  </option>
                  {CategoriesData?.map((item, idx) => (
                    <option key={idx} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {whatsappData.salon_service === "Other" && (
                  <input
                    type="text"
                    className="w-full mt-3 px-4 py-3 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      borderColor: "#502DA630",
                    }}
                    placeholder="Enter Salon Service"
                    value={whatsappData.other_service}
                    onChange={(e) => {
                      setWhatsappData({
                        ...whatsappData,
                        other_service: e.target.value,
                      });
                    }}
                    required
                  />
                )}
              </div>

              {/* City */}
              <div className="mb-5">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#502DA6" }}
                >
                  <Building2 size={16} className="inline mr-2" />
                  City
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderColor: "#502DA630",
                  }}
                  name="city"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (e.target.value === "Other") {
                      setWhatsappData({ ...whatsappData, city: "Other" });
                      return;
                    }
                    const data = City.find((item) => {
                      return item.id === parseInt(e.target.value);
                    });
                    setWhatsappData({ ...whatsappData, city: data.name });
                  }}
                  required
                >
                  <option value="" disabled selected hidden>
                    Select City
                  </option>
                  {City?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {formData.city === "Other" && (
                  <input
                    type="text"
                    className="w-full mt-3 px-4 py-3 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      borderColor: "#502DA630",
                    }}
                    placeholder="Enter City"
                    value={whatsappData.other_city}
                    onChange={(e) => {
                      setWhatsappData({
                        ...whatsappData,
                        other_city: e.target.value,
                      });
                    }}
                    required
                  />
                )}
              </div>

              {/* Area */}
              <div className="mb-8">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#502DA6" }}
                >
                  <MapPinned size={16} className="inline mr-2" />
                  Area / Locality
                </label>
                {formData.city !== "Other" ? (
                  <select
                    className="w-full px-4 py-3 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      borderColor: "#502DA630",
                    }}
                    name="area"
                    value={whatsappData.area}
                    onChange={(e) => {
                      setWhatsappData({
                        ...whatsappData,
                        area: e.target.value,
                      });
                    }}
                    required
                  >
                    <option value="" disabled selected hidden>
                      Select Area
                    </option>
                    {area?.map((item, idx) => (
                      <option key={idx} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      borderColor: "#502DA630",
                    }}
                    placeholder="Enter Area"
                    value={whatsappData.area}
                    onChange={(e) => {
                      setWhatsappData({
                        ...whatsappData,
                        area: e.target.value,
                      });
                    }}
                    required
                  />
                )}
              </div>
            </div>

            {/* Right Side - Brand & CTA */}
            <div
              className="p-3 lg:p-4 flex flex-col justify-between"
              style={{ background: "#3B1E80" }}
            >
              <div>
                {/* Trust Badge */}
                <div className="bg-white/15 rounded-2xl p-3 mb-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-wider mb-4">
                    <Star size={14} />
                    <span>Why Book With Us?</span>
                  </div>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} />
                      <span>Verified salons only</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <Sparkles size={18} />
                      <span>Expert professionals</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Headphones size={18} />
                      <span>24/7 customer support</span>
                    </li>
                  </ul>
                </div>

                {/* Offer Card */}
                <div className="bg-white/15 rounded-2xl p-3 border border-gray-300 backdrop-blur-sm">
                  <div className="text-white/80 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Gift size={14} />
                    Exclusive Offer
                  </div>
                  <div className="text-white text-3xl font-bold mb-2">
                    Flat 20% OFF
                  </div>
                  <div className="text-white/70 text-sm">
                    on your first salon booking through WhatsApp
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-gray-50 font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  style={{ color: "#502DA6" }}
                >
                  <MessageCircle size={20} />
                  Get Offers on WhatsApp
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <div className="text-center mt-6">
                  <p className="text-indigo-200 text-xs">
                    Get Amazing Discounts & Offers Now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WhatsappForm;
