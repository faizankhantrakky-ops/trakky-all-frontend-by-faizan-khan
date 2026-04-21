import React, { useState, useEffect, useRef, useContext } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import toast from "react-hot-toast";

const SalonProductForm = ({
  salonProductDataList,
  setSalonProductDataList,
  closeModal,
}) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState(
    salonProductDataList?.salon_city || ""
  );
  const [masterProductId, setMasterProductId] = useState(
    salonProductDataList?.masterproduct
  );
  const [selectedSalonId, setSelectedSalonId] = useState({
    value: salonProductDataList?.salon,
    label: salonProductDataList?.salon_name,
  });
  const [salonProductData, setSalonProductData] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);

  useEffect(() => {
    if (salonProductDataList) {
      setSelectedCity(salonProductDataList?.salon_city);
      setMasterProductId(salonProductDataList?.masterproduct);
      setSelectedSalonId({
        value: salonProductDataList?.salon,
        label: salonProductDataList?.salon_name,
      });
    }
  }, [salonProductDataList]);

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/salons/city/`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setCityPayload(data?.payload || []);
      const cityNames = data?.payload?.map((item) => item.name) || [];
      setCity(cityNames);
    } catch (err) {
      alert(err);
    }
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
        const options =
          data?.results?.map((salon) => ({
            value: salon.id,
            label: salon.name,
          })) || [];
        callback(options);
      } catch (error) {
        console.error("Error fetching salons:", error.message);
        callback([]);
      }
    }
  };

  const getMasterProduct = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/masterproducts/`,
        {
          headers: {
            Authorization: "Bearer " + authTokens.access,
          },
        }
      );

      const data = await response.json();
      console.log("Salon Product Data:", data);

      if (response.ok) {
        setSalonProductData(data?.results || []);
      } else {
        throw new Error(`HTTP status ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching master products:", error.message);
      toast.error("Failed to fetch master products");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      salon: selectedSalonId?.value,
      masterproduct: Number(masterProductId),
    };

    try {
      let response;
      if (salonProductDataList) {
        response = await fetch(
          `https://backendapi.trakky.in/salons/productofsalon/${salonProductDataList.id}`,
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
        response = await fetch(
          "https://backendapi.trakky.in/salons/productofsalon/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens?.access}`,
            },
            body: JSON.stringify(formData),
          }
        );
      }

      if (!response.ok) {

        if (response.status === 409) {
          let data = await response.json();
          if (data?.detail) {
            toast.error(data.detail);
            return;
          }
        }

        throw new Error(`HTTP status ${response.status}`);
      }

      setSelectedCity("");
      setSelectedSalonId(null);
      setMasterProductId("");
      const result = await response.json();

      if (salonProductDataList) {
        setSalonProductDataList(result);
        closeModal();
      }

      toast.success(
        salonProductDataList
          ? "Form Updated successfully"
          : "Form submitted successfully"
      );
      console.log(result);
    } catch (error) {
      console.error("Error submitting form:", error.message);
      toast.error("Failed to submit form");
    }
  };

  useEffect(() => {
    getMasterProduct();
  }, []);

  useEffect(() => {
    getCity();
  }, []);

  return (
    <>
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Salon Product</h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                name="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  setMasterProductId("");
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
                  Salon Must belong to the selected city
                </span>
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadSalons}
                onChange={(selectedOption) => {
                  setSelectedSalonId(selectedOption);
                }}
                value={selectedSalonId}
                placeholder="Search salons"
                isDisabled={!selectedCity}
                required
                noOptionsMessage={() => "No salons found"}
              />
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="product">Select Master Product Service</label>
              <select
                name="product"
                id="product"
                required
                value={masterProductId || ""}
                onChange={(e) => {
                  setMasterProductId(e.target.value);
                }}
              >
                <option value="">---Select---</option>
                {salonProductData?.map((product, index) => (
                  <option
                    value={product.id}
                    key={index}
                    description={product.description}
                  >
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="submit-btn row">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SalonProductForm;
