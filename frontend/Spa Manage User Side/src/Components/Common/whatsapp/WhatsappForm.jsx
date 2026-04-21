import React from "react";
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
  const { user, authTokens } = React.useContext(AuthContext);
  const [City, setCity] = React.useState([]);
  const [area, setarea] = React.useState([]);
  const [CategoriesData, setCategoriesData] = React.useState([]);
  const [formData, setFormData] = React.useState({
    city: null,
    area: null,
  });
  const [userData, setUserData] = React.useState({});

  React.useEffect(() => {
    const get_user_data = async () => {
      if (user) {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/spauser/${user.user_id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          }
        );
        const data = await response.json();
        setUserData(data);
      }
    };
    get_user_data();
  }, [user]);

  const [whatsappData, setWhatsappData] = React.useState({
    city: "",
    area: "",
    spa_service: "",
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
      fetch("https://backendapi.trakky.in/spas/therapy/", requestOption)
        .then((res) => res.json())
        .then((data) => {
          setCategoriesData(data);
        })
        .catch((err) => console.log(err));
    };
    getCategories();
  }, []);

  const getcity = async () => {
    const response = await fetch("https://backendapi.trakky.in/spas/city/");
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

  const handleServiceChange = (event) => {
    setWhatsappData({ ...whatsappData, spa_service: event.target.value });
  };

  const handleWhatsAppChat = () => {
    const { username, phone_number, email } = userData;
    const {
      spa_service,
      city,
      area,
      other_city,
      other_area,
      other_service,
    } = whatsappData;
  
    // Validate mandatory fields
    if (!spa_service || !city || !area) {
      alert("Please select service, city, and area");
      return;
    }
  
    // Update values if "Other" is selected
    const updatedData = { ...whatsappData }; // Create a copy to avoid direct modification
    if (city === "Other" && other_city) {
      updatedData.city = other_city;
      delete updatedData.other_city; // Remove unnecessary "Other" field
    }
  
    if (area === "Other" && other_area) {
      updatedData.area = other_area;
      delete updatedData.other_area; // Remove unnecessary "Other" field
    }
  
    if (spa_service === "Other" && other_service) {
      updatedData.spa_service = other_service;
      delete updatedData.other_service; // Remove unnecessary "Other" field
    }
  
    const whatsappMessage = `Can I get information about the spa for ${
      updatedData.spa_service
    } in ${updatedData.area}, ${
      updatedData.city
    }?\n\n`;
  
    let whatsappURL = `https://api.whatsapp.com/send?phone=916355167304&text=${encodeURIComponent(
      whatsappMessage
    )}`;
  
    // Append user data if available
    if (username && phone_number && email) {
      const userDataString = `Name: ${
        username
      }\nPhone Number: ${
        phone_number
      }\nEmail: ${email}`;
      whatsappURL += `%0A%0A${encodeURIComponent(userDataString)}`;
    }
  
    // Open the WhatsApp chat in a new tab/window
    window.open(whatsappURL, "_blank");
  };
  
  
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleWhatsAppChat();
      }}
    >
      <div className="shadow-lg bg-white flex max-w-[360px] flex-col px-7 md:px-10 py-6 rounded-3xl">
        <div className="self-center flex items-stretch gap-2 mt-2.5">
          <img src={trakkypurple} style={{ height: "30px" }} alt="logo" />
          <div className="text-black text-base grow whitespace-nowrap mt-1.5 self-start">
            For spa therapies
          </div>
        </div>
        <div className="text-black text-base self-stretch mt-7 ml-1" >
          Spa Service
        </div>
        <select
          type="text"
          className="text-slate-600 text-sm whitespace-nowrap bg-slate-200 self-stretch justify-center mt-2.5 pl-3 pr-16 py-2 rounded-xl items-start"
          name="spa_service"
          id=""
          style={styles}
          onChange={handleServiceChange}
          required
        >
          <option className="text-[0.9rem]" disabled selected hidden>
            Select Spa Service
          </option>
          {CategoriesData?.map((item) => {
            return (
              <option className="text-[0.9rem]" style={{ background: "white" }}>
                {item.name}
              </option>
            );
          })}
          <option className="text-[0.9rem]" style={{ background: "white" }}>
            Other
          </option>
        </select>
        {whatsappData.spa_service === "Other" && (
          <input
            type="text"
            className="text-slate-600 text-sm whitespace-nowrap bg-slate-200 self-stretch justify-center mt-2.5 pl-3 pr-16 py-2 rounded-xl items-start"
            name="spa_service"
            id=""
            placeholder="Enter Spa Service"
            value={whatsappData.other_service}
            onChange={(e) => {
              setWhatsappData({ ...whatsappData, other_service: e.target.value });
            }}
            required
          />
        )}
        <div className="text-black text-sm self-stretch mt-4 ml-1">City</div>
        <select
          className="text-slate-600 text-sm whitespace-nowrap bg-slate-200 self-stretch justify-center mt-2.5 pl-3 pr-16 py-2 rounded-xl items-start"
          name="city"
          id=""
          value={formData.city}
          onChange={(e) => {
            setFormData({ ...formData, city: e.target.value });
            if (e.target.value === "Other") {
              setWhatsappData({ ...whatsappData, city: "Other" })
              return;
            }
            const data = City.find((item) => {
              return item.id === parseInt(e.target.value);
            });
            setWhatsappData({ ...whatsappData, city: data.name });
          }}
          style={styles}
          required
        >
          <option className="text-[0.9rem]" disabled selected hidden>
            Select City
          </option>
          {City?.map((item) => {
            return (
              <option
                className="text-[0.9rem]"
                style={{ background: "white" }}
                value={item.id}
              >
                {item.name}
              </option>
            );
          })}
          <option className="text-[0.9rem]" style={{ background: "white" }}>
            Other
          </option>
        </select>
        {formData.city === "Other" && (
          <input
            type="text"
            className="text-slate-600 text-sm whitespace-nowrap bg-slate-200 self-stretch justify-center mt-2.5 pl-3 pr-16 py-2 rounded-xl items-start"
            name="city"
            id=""
            placeholder="Enter City"
            value={whatsappData.other_city}
            onChange={(e) => {
              setWhatsappData({ ...whatsappData, other_city: e.target.value });
            }}
            required
          />
        )}
        <div className="text-black text-sm self-stretch mt-4 ml-1">Area</div>
        {formData.city !== "Other" ? (
        <select
          type="text"
          className="text-slate-600 text-sm whitespace-nowrap bg-slate-200 self-stretch justify-center mt-2.5 pl-3 pr-16 py-2 rounded-xl items-start"
          name="area"
          id=""
          value={whatsappData.area}
          onChange={(e) => {
            setWhatsappData({ ...whatsappData, area: e.target.value });
          }}
          style={styles}
          required
        >
          <option className="text-[0.9rem]" disabled selected hidden>
            Select Area
          </option>
          {area?.map((item) => {
            return (
              <option
                className="text-[0.9rem]"
                value={item}
                style={{ background: "white" }}
              >
                {item}
              </option>
            );
          })}
        </select>
        ) : (
          <input
            type="text"
            className="text-slate-600 text-sm whitespace-nowrap bg-slate-200 self-stretch justify-center mt-2.5 pl-3 pr-16 py-2 rounded-xl items-start"
            name="area"
            id=""
            placeholder="Enter Area"
            value={whatsappData.area}
            onChange={(e) => {
              setWhatsappData({ ...whatsappData, area: e.target.value });
            }}
            required
          />
        )}
        <button
          type="submit"
          className="text-white text-sm whitespace-nowrap justify-center items-center bg-cyan-600 self-stretch mt-6 px-4 py-2 rounded-xl"
        >
          Suggest Spa & Offers On Whatsapp
        </button>
        <div className="text-black text-xs font-light self-center whitespace-nowrap mt-3.5">
          Get Amazing Discounts & Offers Now
        </div>
      </div>
    </form>
  );
}

export default WhatsappForm;
