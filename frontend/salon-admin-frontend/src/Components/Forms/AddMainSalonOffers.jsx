import React, { useState, useContext, useEffect } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import "quill/dist/quill.snow.css";
import useGetCities from "../../hooks/useGetCities";
import Quill from "quill";
import { useRef } from "react";

const AddMainSalonOffers = ({
  offerItem,
  refreshData,
  setOffers,
  closeModal,
}) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const { citiesData, cityLoading, cityError, selectedCity, setSelectedCity } =
    useGetCities();

  const [offerFormat, setOfferFormat] = useState([
    { lable: "₹ off above ₹", type: "type_1" },
    { lable: "% off upto ₹", type: "type_2" },
    { lable: "get % off on services", type: "type_3" },
    { lable: "get ₹ off", type: "type_4" },
    { lable: "get ₹ off on services", type: "type_5" },
    { lable: "service at ₹", type: "type_6" },
  ]);
  const [offerFormatSelected, setOfferFormatSelected] = useState("");

  const offersDetails = {
    type_1: {
      amount_off: 0,
      minimum_value: 0,
    },
    type_2: {
      percentage_off: 0,
      max_offer_limit: 0,
    },
    type_3: {
      percentage_off: 0,
    },
    type_4: {
      amount_off: 0,
    },
    type_5: {
      service_amout: 0,
    },
    type_6: {
      service_amout: 0,
    },
  };

  const [files, setFiles] = useState(null);

  const [formData, setFormData] = useState({
    offer_display_name: "",
    offer_display_sub_name: "",
    term_condition: "",
    offer_code: "",
    offer_type: "",
    offer_extra_details: {},
    all_services: "yes",
    included_services: [],
    expire_date: null,
    starting_date: null,
    club_with_other_offer: "no",
    active_status: "yes",
    image: "",
    salon: null,
  });

  const editorRef = useRef(null);

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
    if (offerItem && editorRef.current) {
      editorRef.current.root.innerHTML = offerItem.terms_and_conditions;
    }
  }, [offerItem]);

  const loadServices = async (inputValue, callback) => {
    if (inputValue !== "") {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/service/?city=${selectedCity}&salon_id=${formData.salon.value}&service_name=${inputValue}`
        );

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const data = await response.json();

        const options = data?.map((service) => ({
          value: service.id,
          label: service.service_name,
          gender: service.gender,
        }));

        callback(options);
      } catch (error) {
        console.error("Error fetching salons:", error.message);
        callback([]);
      }
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

  const handleSubmit = async (event) => {
    // ready json data of type

    event.preventDefault();

    let offerDetails = {};
    let display_name = "";

    if (offerFormatSelected === "type_1") {
      offerDetails = {
        amount_off: formData.offer_extra_details.amount_off,
        minimum_value: formData.offer_extra_details.minimum_value,
      };
    } else if (offerFormatSelected === "type_2") {
      offerDetails = {
        percentage_off: formData.offer_extra_details.percentage_off,
        max_offer_limit: formData.offer_extra_details.max_offer_limit,
      };
    } else if (offerFormatSelected === "type_3") {
      offerDetails = {
        percentage_off: formData.offer_extra_details.percentage_off,
      };
    } else if (offerFormatSelected === "type_4") {
      offerDetails = {
        amount_off: formData.offer_extra_details.amount_off,
      };
    } else if (offerFormatSelected === "type_5") {
      offerDetails = {
        service_amout: formData.offer_extra_details.service_amout,
      };
    } else if (offerFormatSelected === "type_6") {
      offerDetails = {
        service_amout: formData.offer_extra_details.service_amout,
      };
    }

    // ready json data of included services
    //  sample payload
    // {
    //   "display_name": "Winter Special Discount",
    //   "display_sub_name": "Get 20% off on all services",
    //   "offer_extra_details": {
    //     "description": "This offer includes all beauty and hair services",
    //     "eligibility": "Valid for all customers"
    //   },
    //   "terms_and_conditions": "Offer valid till stocks last. Cannot be combined with other offers.",
    //   "offer_code": "WINTER20",
    //   "offer_type": "Percentage",
    //   "salon": 29,  // Replace with actual salon ID
    //   "included_services": [1, 2, 3],  // Replace with actual service IDs
    //   "all_services": false,
    //   "expire_date": "2024-12-31",
    //   "priority": 2,
    //   "starting_date": "2024-10-01",
    //   "club_with_other_offer": true,
    // //   "image": null,  // If uploading an image, this can be done as a file upload
    //   "created_at": "2024-10-15T10:00:00Z"
    // }

    console.log(formData.salon);

    const payloadFormData = new FormData();
    payloadFormData.append("display_name", formData.offer_display_name);
    payloadFormData.append("display_sub_name", formData.offer_display_sub_name);
    payloadFormData.append("offer_extra_details", JSON.stringify(offerDetails));
    payloadFormData.append(
      "terms_and_conditions",
      editorRef.current.root.innerHTML
    );
    payloadFormData.append("offer_code", formData.offer_code);
    payloadFormData.append("offer_type", offerFormatSelected);
    payloadFormData.append("salon", formData.salon.value);
    // payloadFormData.append("all_services", formData.all_services);
    if (formData.all_services === "yes") {
      payloadFormData.append("all_services", true);
    } else {
      payloadFormData.append("all_services", false);
    }
    payloadFormData.append("expire_date", formData.expire_date);
    payloadFormData.append("starting_date", formData.starting_date);
    // payloadFormData.append(
    //   "club_with_other_offer",
    //   formData.club_with_other_offer
    // );
    if (formData.club_with_other_offer === "yes") {
      payloadFormData.append("club_with_other_offer", true);
    } else {
      payloadFormData.append("club_with_other_offer", false);
    }
    // payloadFormData.append("active_status", formData.active_status);
    if (formData.active_status === "yes") {
      payloadFormData.append("active_status", true);
    } else {
      console.log("active_status", formData.active_status);
      payloadFormData.append("active_status", false);
    }
    // payloadFormData.append("image", null);
    payloadFormData.append(
      "included_services",
      JSON.stringify(formData.included_services.map((service) => service.value))
    );
    if (files) {
      payloadFormData.append("image", files);
    }

    try {
      if (offerItem) {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/offernewpage/${offerItem.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
            body: payloadFormData,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        if (response.ok) {
          console.log("Offer updated successfully");
          toast.success("Offer updated successfully");
          refreshData();
          closeModal();
        } else {
          throw new Error("Something went wrong");
        }
      } else {
        const response = await fetch(
          "https://backendapi.trakky.in/salons/offernewpage/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
            body: payloadFormData,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        if (response.ok) {
          console.log("Offer added successfully");
          toast.success("Offer added successfully");
          setFormData({
            offer_display_name: "",
            offer_display_sub_name: "",
            term_condition: "",
            offer_code: "",
            offer_type: "",
            offer_extra_details: {},
            all_services: "yes",
            included_services: [],
            expire_date: null,
            starting_date: null,
            club_with_other_offer: "no",
            active_status: "yes",
            image: "",
            salon: null,
          });
        } else {
          throw new Error("Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error adding offer:", error.message);
      toast.error("Error adding offer");
    }
  };

  const getFormatedTag = () => {
    if (offerFormatSelected) {
      let offerDisplayName = "";

      if (offerFormatSelected === "type_1") {
        // let offerDisplayName = "₹ off above ₹";
        offerDisplayName = `₹${formData.offer_extra_details?.amount_off} off above ₹${formData.offer_extra_details?.minimum_value}`;
      } else if (offerFormatSelected === "type_2") {
        // let offerDisplayName = "% off upto ₹";
        offerDisplayName = `${formData.offer_extra_details?.percentage_off}% off upto ₹${formData.offer_extra_details?.max_offer_limit}`;
      } else if (offerFormatSelected === "type_3") {
        // let offerDisplayName = "get % off on services";
        offerDisplayName = `get ${formData.offer_extra_details?.percentage_off}% off on services`;
      } else if (offerFormatSelected === "type_4") {
        // let offerDisplayName = "get ₹ off";
        offerDisplayName = `get ₹${formData.offer_extra_details?.amount_off} off`;
      } else if (offerFormatSelected === "type_5") {
        // let offerDisplayName = "get ₹ off on services";
        offerDisplayName = `get ₹${formData.offer_extra_details?.service_amout} off on services`;
      } else if (offerFormatSelected === "type_6") {
        // let offerDisplayName = "service at ₹";
        offerDisplayName = `service at ₹${formData.offer_extra_details?.service_amout}`;
      }

      setFormData({
        ...formData,
        offer_display_name: offerDisplayName,
      });
    }
  };

  useEffect(() => {
    getFormatedTag();
  }, [offerFormatSelected, formData?.offer_extra_details]);

  useEffect(() => {
    if (offerItem) {
      let sampleData = {
        ...formData,
        salon: {
          value: offerItem.salon_details.salon_id,
          label: offerItem.salon_details.salon_name,
        },
        offer_display_name: offerItem.display_name,
        offer_display_sub_name: offerItem.display_sub_name,
        offer_code: offerItem.offer_code,
        offer_type: offerItem.offer_type,
        offer_extra_details: offerItem.offer_extra_details,
        all_services: offerItem.all_services ? "yes" : "no",
        // included_services: offerItem?.services_details?.map((service) => ({
        //   value: service?.service_id,
        //   label: service?.service_name,
        // })) || [],
        included_services:
          typeof offerItem?.services_details === "string"
            ? []
            : offerItem?.services_details?.map((service) => ({
              value: service?.service_id,
              label: service?.service_name,
            })) || [],
        expire_date: offerItem.expire_date,
        starting_date: offerItem.starting_date,
        club_with_other_offer: offerItem.club_with_other_offer ? "yes" : "no",
        active_status: offerItem.active_status ? "yes" : "no",
        image: "",
      };

      if (offerItem.offer_type === "type_1") {
        sampleData = {
          ...sampleData,
          offer_extra_details: {
            amount_off: offerItem?.offer_extra_details?.amount_off,
            minimum_value: offerItem?.offer_extra_details?.minimum_value,
          },
        };
      } else if (offerItem.offer_type === "type_2") {
        sampleData = {
          ...sampleData,

          offer_extra_details: {
            percentage_off: offerItem?.offer_extra_details?.percentage_off,
            max_offer_limit: offerItem?.offer_extra_details?.max_offer_limit,
          },
        };
      } else if (offerItem.offer_type === "type_3") {
        sampleData = {
          ...sampleData,
          offer_extra_details: {
            percentage_off: offerItem?.offer_extra_details?.percentage_off,
          },
        };
      } else if (offerItem.offer_type === "type_4") {
        sampleData = {
          ...sampleData,
          offer_extra_details: {
            amount_off: offerItem?.offer_extra_details?.amount_off,
          },
        };
      } else if (offerItem.offer_type === "type_5") {
        sampleData = {
          ...sampleData,
          offer_extra_details: {
            service_amout: offerItem?.offer_extra_details?.service_amout,
          },
        };
      } else if (offerItem.offer_type === "type_6") {
        sampleData = {
          ...sampleData,
          offer_extra_details: {
            service_amout: offerItem?.offer_extra_details?.service_amout,
          },
        };
      }

      setFormData(sampleData);

      setSelectedCity(offerItem?.salon_details?.city);
      // loadSalons(offerItem?.salon_details?.name, (options) => {
      //   setFormData({
      //     ...formData,
      //     salon: {
      //       value: offerItem.salon_details.id,
      //       label: offerItem.salon_details.name,
      //     },
      //   });
      // });

      setOfferFormatSelected(offerItem.offer_type);
    }
  }, [offerItem]);

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">
              {offerItem ? "Update" : "Add"} Offer page
            </h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                disabled={offerItem}
                name="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    salon: null,
                  });
                  setSelectedCity(e.target.value);
                }}
              >
                <option valu e="">
                  Select City
                </option>
                {citiesData?.map((item, index) => (
                  <option key={index} value={item?.name}>
                    {item?.name}
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
                  Salon Must belongs to Selected city
                </span>
              </label>
              <AsyncSelect
                required
                isDisabled={!selectedCity}
                defaultOptions
                loadOptions={loadSalons}
                value={formData?.salon}
                onChange={(selectedSalon) => {
                  setOfferFormatSelected("");
                  setFormData({
                    ...formData,
                    salon: selectedSalon,
                  });
                  console.log(selectedSalon.value);
                }}
                getOptionLabel={(option) => {
                  return option.label;
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
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select Offer Format</label>
              <select
                required
                name="id"
                id="id"
                value={offerFormatSelected}
                onChange={(e) => {
                  // setOffersDetailData({});
                  setOfferFormatSelected(e.target.value);
                  // type 6
                  // if (e.target.value === "type_6") {
                  //   setFormData({
                  //     ...formData,
                  //     all_services: "no",
                  //   });
                  // }

                  let tempD = {
                    ...formData,
                    offer_extra_details: {},
                  };

                  if (e.target.value === "type_6") {
                    tempD = {
                      ...tempD,
                      all_services: "no",
                    };
                  }

                  setFormData(tempD);
                }}
              >
                <option value="">Select Offer Format</option>
                {offerFormat.map((item, index) => (
                  <option key={index} value={item.type}>
                    {item.lable}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {offerFormatSelected === "type_1" && (
            <div className="row">
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="amount_off">Amount Off</label>
                <input
                  type="number"
                  name="amount_off"
                  id="amount_off"
                  value={formData.offer_extra_details?.amount_off}
                  placeholder="Enter Amount Off"
                  onChange={(e) => {
                    // setOffersDetailData({
                    //   ...offersDetailData,
                    //   amount_off: e.target.value,
                    // });
                    setFormData({
                      ...formData,
                      offer_extra_details: {
                        ...formData.offer_extra_details,
                        amount_off: e.target.value,
                      },
                    });

                  }}
                />
              </div>
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="minimum_value">Minimum Value</label>
                <input
                  type="number"
                  name="minimum_value"
                  id="minimum_value"
                  value={formData.offer_extra_details?.minimum_value}
                  placeholder="Enter Minimum Value"
                  onChange={(e) => {
                    // setOffersDetailData({
                    //   ...offersDetailData,
                    //   minimum_value: e.target.value,
                    // });
                    setFormData({
                      ...formData,
                      offer_extra_details: {
                        ...formData.offer_extra_details,
                        minimum_value: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          )}
          {offerFormatSelected === "type_2" && (
            <div className="row">
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="percentage_off">Percentage Off</label>
                <input
                  type="number"
                  name="percentage_off"
                  id="percentage_off"
                  value={formData.offer_extra_details?.percentage_off}
                  placeholder="Enter Percentage Off"
                  onChange={(e) => {
                    // setOffersDetailData({
                    //   ...offersDetailData,
                    //   percentage_off: e.target.value,
                    // });

                    setFormData({
                      ...formData,
                      offer_extra_details: {
                        ...formData.offer_extra_details,
                        percentage_off: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="max_offer_limit">Max Offer Limit</label>
                <input
                  type="number"
                  name="max_offer_limit"
                  id="max_offer_limit"
                  value={formData.offer_extra_details?.max_offer_limit}
                  placeholder="Enter Max Offer Limit"
                  onChange={(e) => {
                    // setOffersDetailData({
                    //   ...offersDetailData,
                    //   max_offer_limit: e.target.value,
                    // });

                    setFormData({
                      ...formData,
                      offer_extra_details: {
                        ...formData.offer_extra_details,
                        max_offer_limit: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          )}
          {offerFormatSelected === "type_3" && (
            <div className="row">
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="percentage_off">Percentage Off</label>
                <input
                  type="number"
                  name="percentage_off"
                  id="percentage_off"
                  value={formData.offer_extra_details?.percentage_off}
                  placeholder="Enter Percentage Off"
                  onChange={(e) => {
                    // setOffersDetailData({
                    //   ...offersDetailData,
                    //   percentage_off: e.target.value,
                    // });
                    setFormData({
                      ...formData,
                      offer_extra_details: {
                        ...formData.offer_extra_details,
                        percentage_off: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          )}
          {offerFormatSelected === "type_4" && (
            <div className="row">
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="amount_off">Amount Off</label>
                <input
                  type="number"
                  name="amount_off"
                  id="amount_off"
                  value={formData.offer_extra_details?.amount_off}
                  placeholder="Enter Amount Off"
                  onChange={(e) => {
                    // setOffersDetailData({
                    //   ...offersDetailData,
                    //   amount_off: e.target.value,
                    // });
                    setFormData({
                      ...formData,
                      offer_extra_details: {
                        ...formData.offer_extra_details,
                        amount_off: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          )}
          {offerFormatSelected === "type_5" && (
            <div className="row">
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="service_amout">Service Amount</label>
                <input
                  type="number"
                  name="service_amout"
                  id="service_amout"
                  value={formData.offer_extra_details?.service_amout}
                  placeholder="Enter Service Amount"
                  onChange={(e) => {
                    // setOffersDetailData({
                    //   ...offersDetailData,
                    //   service_amout: e.target.value,
                    // });
                    setFormData({
                      ...formData,
                      offer_extra_details: {
                        ...formData.offer_extra_details,
                        service_amout: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          )}
          {offerFormatSelected === "type_6" && (
            <div className="row">
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="service_amout">Service Amount</label>
                <input
                  type="number"
                  name="service_amout"
                  id="service_amout"
                  value={formData.offer_extra_details?.service_amout}
                  placeholder="Enter Service Amount"
                  onChange={(e) => {
                    // setOffersDetailData({
                    //   ...offersDetailData,
                    //   service_amout: e.target.value,
                    // });
                    setFormData({
                      ...formData,
                      offer_extra_details: {
                        ...formData.offer_extra_details,
                        service_amout: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          )}
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="all-service">All services</label>
              <select
                name="all-service"
                id="all-service"
                required
                value={formData?.all_services || ""}
                onChange={(e) => {
                  if (e.target.value === "yes") {
                    setFormData({
                      ...formData,
                      all_services: "yes",
                      included_services: [],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      all_services: "no",
                    });
                  }
                }}
                disabled={offerFormatSelected == "type_6"}
              >
                <option value="">---Select---</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="included-service">included services</label>
              <AsyncSelect
                isMulti
                // isDisabled={formData.all_services}
                defaultOptions
                loadOptions={loadServices}
                value={formData?.included_services}
                onChange={(selectedServices) => {
                  setFormData({
                    ...formData,
                    included_services: selectedServices,
                  });
                }}
                getOptionLabel={(option) => {
                  return `${option.label} - ${option.gender}`;
                }}
                getOptionValue={(option) => {
                  return option.value;
                }}
                noOptionsMessage={() => "No services found"}
                placeholder="Search Services..."
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
                isDisabled={formData?.all_services === "yes"}
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
                value={formData?.starting_date || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    starting_date: e.target.value,
                  });
                }}
              />
            </div>
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="all-service">End Date</label>
              <input
                type="date"
                name="end_date"
                id="end_date"
                value={formData?.expire_date || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    expire_date: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className=" row">
            <div className="input-box inp-id col-1 col-3">
              <label htmlFor="all-service">Offer Code</label>
              <input
                type="text"
                name="offer_code"
                id="offer_code"
                value={formData?.offer_code}
                placeholder="Enter Offer Code"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    offer_code: e.target.value,
                  });
                }}
              />
            </div>
            <div className="input-box inp-id col-1 col-3">
              <label htmlFor="all-service">Club With Other Offer</label>
              <select
                name="club_with_other_offer"
                id="club_with_other_offer"
                required
                value={formData?.club_with_other_offer || ""}
                onChange={(e) => {
                  if (e.target.value === "yes") {
                    setFormData({
                      ...formData,
                      club_with_other_offer: "yes",
                    });
                  } else {
                    setFormData({
                      ...formData,
                      club_with_other_offer: "no",
                    });
                  }
                }}
              >
                <option value="">---Select---</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="input-box inp-id col-1 col-3">
              <label htmlFor="all-service">Active Status</label>
              <select
                name="active_status"
                id="active_status"
                required
                value={formData?.active_status}
                onChange={(e) => {
                  if (e.target.value === "yes") {
                    setFormData({
                      ...formData,
                      active_status: "yes",
                    });
                  } else {
                    setFormData({
                      ...formData,
                      active_status: "no",
                    });
                  }
                }}
              >
                <option value="">---Select---</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="offer_display_name">Offer Display Name</label>
              <input
                type="text"
                name="offer_display_name"
                id="offer_display_name"
                value={formData?.offer_display_name}
                placeholder="Enter Offer Display Name"
                disabled
              />
            </div>
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="offer_display_sub_name">
                Offer Display Sub Name
              </label>
              <input
                type="text"
                name="offer_display_sub_name"
                id="offer_display_sub_name"
                value={formData?.offer_display_sub_name}
                placeholder="Enter Offer Display Sub Name"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    offer_display_sub_name: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="content">Terms & Conditions</label>
              <div id="editor" style={{ width: "100%", height: "100px" }}></div>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="image">Upload Image</label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={(e) => {
                  setFiles(e.target.files[0]);
                }}
              />
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

export default AddMainSalonOffers;
