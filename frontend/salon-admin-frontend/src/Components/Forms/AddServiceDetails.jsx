import React, { useState, useContext, useEffect } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import "quill/dist/quill.snow.css";
import useGetCities from "../../hooks/useGetCities";
import Quill from "quill";
import { useRef } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// service:410
// faqs:[{"question": "What is this service?", "answer": "This is a beauty treatment."}]
// steps:[{"step": 1, "instruction": "Prepare hair."}, {"step": 2, "instruction": "Apply treatment."}]
// overview:2
// do_and_dont:[{"do": "Wash hair", "dont": "Use hot water."}]
// main_swipper_url:["https://example.com/swipe1.jpg", "https://example.com/swipe2.jpg"]
const AddServiceDetails = ({ serviceDetailsData, closeModal, refreshData }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const { citiesData, cityLoading, cityError, selectedCity, setSelectedCity } =
    useGetCities();
  const [files, setFiles] = useState(null);
  const [formData, setFormData] = useState({
    salon: null,
    service: [],
    faqs: [],
    dos: [],
    donts: [],
  });
  const [tempQues, setTempQues] = useState({
    que: "",
    ans: "",
  });
  const [tempDos, setTempDos] = useState("");
  const [tempDonts, setTempDonts] = useState("");
  const [steps, setSteps] = useState([
    {
      step: 1,
      instruction: "",
      image_data: null,
      image_url: null,
    },
  ]);
  const [desImg, setDesImg] = useState(null);
  const [keyIngredientImg, setKeyIngredientImg] = useState(null);
  // things_salon_use,things_salon_use,lux_exprience_image,benefit_meta_info_image,aftercare_tips all are img like above
  const [thingsSalonUseImg, setThingsSalonUseImg] = useState(null);
  const [luxExprienceImg, setLuxExprienceImg] = useState(null);
  const [benefitMetaInfoImg, setBenefitMetaInfoImg] = useState(null);
  const [aftercareTipsImg, setAftercareTipsImg] = useState(null);
  // main swiper images multiple
  const [mainSwiperImg, setMainSwiperImg] = useState(null);
  const [overviewData, setOverviewData] = useState([]);
  const getOverviews = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/overviews/`;
      const response = await fetch(url);
      if (response.status === 200) {
        const data = await response.json();
        setOverviewData(data);
      } else if (response.status === 401) {
        toast.error("Unauthorized access. Please log in again.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch areas. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
const loadServices = async (inputValue, callback) => {
  if (!inputValue || inputValue.trim() === "") {
    callback([]);
    return;
  }

  if (!selectedCity || !formData.salon?.value) {
    callback([]);
    return;
  }

  try {
    const response = await fetch(
      `https://backendapi.trakky.in/salons/service/?city=${selectedCity}&salon_id=${formData.salon.value}&service_name=${inputValue}`
    );

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    const data = await response.json();

    // API returns direct array, NOT { results: [...] }
    const services = Array.isArray(data) ? data : data?.results || [];

    const options = services.map((service) => ({
      value: service.id,
      label: service.service_name,
      gender: service.gender || "Unisex",
    }));

    callback(options);
  } catch (error) {
    console.error("Error fetching services:", error.message);
    toast.error("Failed to load services");
    callback([]);
  }
};
  const handleStepImageUpload = async () => {
    // do it with promise all
    // for those only which have image_data
    // after uploading all images set image_url & set null to image_data
    // endpoint: /salons/serivce-detail-step-image/
    const promises = steps.map((step) => {
      if (step.image_data) {
        const formData = new FormData();
        formData.append("image", step.image_data);
        return fetch(
          "https://backendapi.trakky.in/salons/serivce-detail-step-image/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
            body: formData,
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP status ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            step.image_url = data.image;
            step.image_data = null;
          })
          .catch((error) => {
            console.error("Error uploading step image:", error.message);
          });
      }
    });
    await Promise.all(promises);
    setSteps([...steps]);
  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  const loadSalons = async (inputValue, callback) => {
    if (inputValue !== "") {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/search-by-type/?name=${encodeURIComponent(
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
          salon_type: salon.salon_type,
        }));
        callback(options);
      } catch (error) {
        console.error("Error fetching salons:", error.message);
        callback([]);
      }
    }
  };
  const buildFormData = (serviceId) => {
    const data = new FormData();
    if (Array.isArray(serviceId)) {
      data.append("service", JSON.stringify(serviceId));
    } else {
      data.append("service", serviceId);
    }
    data.append("faqs", JSON.stringify(formData.faqs));
    data.append(
      "do_and_dont",
      JSON.stringify({
        do: formData.dos,
        "don't": formData.donts,
      })
    );
    data.append("overview", formData.overview);
    data.append(
      "steps",
      JSON.stringify(
        steps.map((step) => ({
          step: step.step,
          instruction: step.instruction,
          image: step.image_url,
          image_data: step.image_data,
        }))
      )
    );
    if (
      formData.salon_type === "PRIME" ||
      formData.salon_type === "LUXURIOUS"
    ) {
      if (keyIngredientImg) {
        data.append("key_ingredients", keyIngredientImg);
      }
    }
    if (
      formData.salon_type === "PRIME" ||
      formData.salon_type === "LUXURIOUS"
    ) {
      if (thingsSalonUseImg) {
        data.append("things_salon_use", thingsSalonUseImg);
      }
    }
    if (formData.salon_type === "LUXURIOUS") {
      if (luxExprienceImg) {
        data.append("lux_exprience_image", luxExprienceImg);
      }
    }
    if (formData.salon_type === "LUXURIOUS") {
      if (benefitMetaInfoImg) {
        data.append("benefit_meta_info_image", benefitMetaInfoImg);
      }
    }
    if (formData.salon_type === "LUXURIOUS") {
      if (aftercareTipsImg) {
        data.append("aftercare_tips", aftercareTipsImg);
      }
    }
    if (
      formData.salon_type === "PRIME" ||
      formData.salon_type === "LUXURIOUS"
    ) {
      mainSwiperImg &&
        [...mainSwiperImg].forEach((file) => {
          data.append("main_swipper_images", file);
        });
    }
    if (desImg) {
      data.append("description_image", desImg);
    }
    return data;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let isStepImageEmpty = false;
    steps.forEach((step) => {
      if (step.image_data) {
        isStepImageEmpty = true;
      }
    });
    if (isStepImageEmpty) {
      toast.error("Please upload all step images");
      return;
    }
    try {
      if (serviceDetailsData) {
        const serviceId = Array.isArray(formData?.service)
          ? formData.service[0]?.value
          : formData?.service?.value;
        if (!serviceId) {
          toast.error("Please select a service");
          return;
        }
        const data = buildFormData(serviceId);
        const response = await fetch(
          `https://backendapi.trakky.in/salons/service-details/${serviceDetailsData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
            body: data,
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        if (response.ok) {
          toast.success("Service details updated successfully");
          closeModal();
        }
      } else {
        const selectedServices = Array.isArray(formData?.service)
          ? formData.service
          : formData?.service
          ? [formData.service]
          : [];
        if (selectedServices.length === 0) {
          toast.error("Please select at least one service");
          return;
        }
        const serviceIds = selectedServices.map((s) => s.value);
        const data = buildFormData(serviceIds);
        const loadingToast = toast.loading(
          `Adding ${serviceIds.length} service detail${
            serviceIds.length > 1 ? "s" : ""
          }...`
        );
        const response = await fetch(
          `https://backendapi.trakky.in/salons/service-details/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
            body: data,
          }
        );
        toast.dismiss(loadingToast);
        if (response.status === 201) {
          toast.success(
            `${serviceIds.length} service detail${
              serviceIds.length > 1 ? "s" : ""
            } added successfully`
          );
          closeModal();
        } else {
          const errText = await response.text().catch(() => "");
          toast.error(`Failed to add service details${errText ? `: ${errText}` : ""}`);
        }
      }
    } catch (error) {
      console.error("Error adding service details:", error.message);
      toast.error("Error adding service details");
    }
  };
  useEffect(() => {
    console.log(serviceDetailsData);
    if (serviceDetailsData) {
      // {
      // "id": 38,
      // "faqs": [
      // {
      // "answer": "first anns",
      // "question": "fiest qu"
      // },
      // {
      // "answer": "second asn",
      // "question": "second que"
      // },
      // {
      // "answer": "third ans",
      // "question": "third que "
      // }
      // ],
      // "steps": [
      // {
      // "step": 1,
      // "image": "https://trakkynew.blob.core.windows.net/trakky-new-pics/service_detail_step_image/97e7d047-3ca2-424c-b739-60b65550d68b.webp",
      // "instruction": "dgndfgfd"
      // },
      // {
      // "step": 2,
      // "image": "https://trakkynew.blob.core.windows.net/trakky-new-pics/service_detail_step_image/74a4afcc-1071-4ccb-9af7-65ae280f674a.webp",
      // "instruction": "dfjdfd"
      // },
      // {
      // "step": 3,
      // "image": "https://trakkynew.blob.core.windows.net/trakky-new-pics/service_detail_step_image/de87427b-b49f-4c90-8721-777bba4a68bf.webp",
      // "instruction": "dfgdf"
      // },
      // {
      // "step": 4,
      // "image": "https://trakkynew.blob.core.windows.net/trakky-new-pics/service_detail_step_image/239cd447-05e1-4198-b99b-a40d6ea7649f.webp",
      // "instruction": "fdbnfd dfdbsn "
      // }
      // ],
      // "do_and_dont": {
      // "do": [
      // "dfbdnd",
      // "dknsdfds",
      // "dfjdsfndf"
      // ],
      // "don't": [
      // "dfbdsj",
      // "sidfhdsfnd",
      // "sdfnf",
      // "dfnfds"
      // ]
      // },
      // "description_image": "https://trakkynew.blob.core.windows.net/trakky-new-pics/service_details_image_upload_path/c7502ed6-93fc-4453-ad49-fd7a70d3d718.webp",
      // "key_ingredients": "https://trakkynew.blob.core.windows.net/trakky-new-pics/service_details_image_upload_path/73d9b41d-e4fe-4a85-a1c4-1808ea2dbaf4.webp",
      // "things_salon_use": "https://trakkynew.blob.core.windows.net/trakky-new-pics/service_details_image_upload_path/0c991299-2a68-46be-880f-e06a588cb2cb.webp",
      // "lux_exprience_image": "https://trakkynew.blob.core.windows.net/trakky-new-pics/service_details_image_upload_path/a93620b1-a9b3-4951-a71d-ac7a6b3dbd39.webp",
      // "benefit_meta_info_image": "https://trakkynew.blob.core.windows.net/trakky-new-pics/service_details_image_upload_path/23a30f2a-9d25-48ef-a595-f6bd9c6afa76.webp",
      // "aftercare_tips": "https://trakkynew.blob.core.windows.net/trakky-new-pics/service_details_image_upload_path/39566c52-2874-44cb-af52-0f9b7bfa56b0.webp",
      // "created_at": "2024-11-21T14:32:46.654076+05:30",
      // "service_info": {
      // "service_name": "Hair Spa - Vitamin Restore",
      // "service_id": 411,
      // "service_details": false,
      // "category_name": null,
      // "salon_name": "Hashtag salon",
      // "salon_type": "CLASSIC",
      // "salon_city": "Ahmedabad",
      // "salon_area": "Bhagwat"
      // },
      // "service": 411,
      // "overview": [
      // 2
      // ]
      // }
      setFormData({
        ...formData,
        service: {
          value: serviceDetailsData?.service,
          label: serviceDetailsData?.service_info?.service_name,
        },
        faqs: serviceDetailsData?.faqs,
        dos: serviceDetailsData?.do_and_dont?.do,
        donts: serviceDetailsData?.do_and_dont?.["don't"],
        salon: {
          value: serviceDetailsData?.service_info?.salon_id,
          label: serviceDetailsData?.service_info?.salon_name,
        },
        salon_type: serviceDetailsData?.service_info?.salon_type,
        overview: serviceDetailsData?.overview_details?.map((item) => item.id).join(","),
      });
      setSelectedCity(serviceDetailsData?.service_info?.salon_city);
    }
  }, [serviceDetailsData]);
  useEffect(() => {
    if (serviceDetailsData?.steps && Array.isArray(serviceDetailsData.steps)) {
      const formattedSteps = serviceDetailsData.steps.map((s, idx) => ({
        step: s.step ?? idx + 1,
        instruction: s.instruction ?? "",
        image_url: s.image || null,
        image_data: null,
      }));

      setSteps(formattedSteps.length > 0 ? formattedSteps : [{
        step: 1,
        instruction: "",
        image_data: null,
        image_url: null,
      }]);
    }
  }, [serviceDetailsData]);
  useEffect(() => {
    getOverviews();
  }, []);
  const addStep = () => {
    setSteps(prev => [
      ...prev,
      {
        step: prev.length + 1,
        instruction: "",
        image_data: null,
        image_url: null,
      },
    ]);
  };
  const removeStep = (index) => {
    setSteps(prev => {
      const newSteps = prev.filter((_, i) => i !== index);
      return newSteps.length > 0 ? newSteps.map((s, i) => ({ ...s, step: i + 1 })) : [{
        step: 1,
        instruction: "",
        image_data: null,
        image_url: null,
      }];
    });
  };
  const moveStepUp = (index) => {
    setSteps(prev => {
      if (index === 0) return prev;
      const newSteps = [...prev];
      [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
      return newSteps.map((s, i) => ({ ...s, step: i + 1 }));
    });
  };
  const moveStepDown = (index) => {
    setSteps(prev => {
      if (index === prev.length - 1) return prev;
      const newSteps = [...prev];
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
      return newSteps.map((s, i) => ({ ...s, step: i + 1 }));
    });
  };
  return (
    <>
      <Toaster />
      <div className="form-container">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row">
            <h3 className="form-title">
              {serviceDetailsData ? "Update" : "Add"} Service details
            </h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                disabled={serviceDetailsData}
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
                  setFormData({
                    ...formData,
                    salon: selectedSalon,
                    salon_type: selectedSalon.salon_type,
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
              <label htmlFor="all-service">Salon type</label>
              <div className=" flex gap-5">
                
                <div className=" flex gap-1">
                  <input
                    type="radio"
                    checked={formData.salon_type === "PRIME"}
                    name="salon_type"
                    value="PRIME"
                  // disabled
                  // onChange={(e) => {
                  // setFormData({
                  // ...formData,
                  // salon_type: e.target.value,
                  // });
                  // }}
                  />
                  <label htmlFor="PRIME">Prime</label>
                </div>
                <div className=" flex gap-1">
                  <input
                    type="radio"
                    checked={formData.salon_type === "CLASSIC"}
                    name="salon_type"
                    value="CLASSIC"
                  // disabled
                  // onChange={(e) => {
                  // setFormData({
                  // ...formData,
                  // salon_type: e.target.value,
                  // });
                  // }}
                  />
                  <label htmlFor="CLASSIC">Classic</label>
                </div>
                <div className=" flex gap-1">
                  <input
                    type="radio"
                    checked={formData.salon_type === "LUXURIOUS"}
                    name="salon_type"
                    value="LUXURIOUS"
                  // disabled
                  // onChange={(e) => {
                  // setFormData({
                  // ...formData,
                  // salon_type: e.target.value,
                  // });
                  // }}
                  />
                  <label htmlFor="LUXURIOUS">LUXURIOUS</label>
                </div>
              </div>
            </div>
          </div>
          <div className=" row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="included-service">
                Select service
                {!serviceDetailsData && (
                  <span className="Note_Inp_Classs">
                    You can select multiple services at a time
                  </span>
                )}
              </label>
              <AsyncSelect
                isMulti={!serviceDetailsData}
                isDisabled={!formData?.salon}
                cacheOptions
                loadOptions={loadServices}
                value={formData?.service}
                onChange={(selectedServices) => {
                  setFormData({
                    ...formData,
                    service: serviceDetailsData
                      ? selectedServices
                      : selectedServices || [],
                  });
                }}
                closeMenuOnSelect={!!serviceDetailsData}
                hideSelectedOptions={false}
                getOptionLabel={(option) => {
                  return `${option.label} - ${option.gender}`;
                }}
                getOptionValue={(option) => {
                  return option.value;
                }}
                noOptionsMessage={() => "No services found"}
                placeholder={
                  !formData?.salon
                    ? "Select salon first..."
                    : serviceDetailsData
                    ? "Search Service..."
                    : "Search & select multiple services..."
                }
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#ccc",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#ccc",
                    },
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#e0f2fe",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#0369a1",
                    fontWeight: 500,
                  }),
                }}
              />
              {!serviceDetailsData &&
                Array.isArray(formData?.service) &&
                formData.service.length > 0 && (
                  <div className="mt-2 text-sm text-gray-700">
                    <strong>{formData.service.length}</strong> service
                    {formData.service.length > 1 ? "s" : ""} selected:{" "}
                    {formData.service
                      .map((s) => `${s.label} (${s.gender})`)
                      .join(", ")}
                  </div>
                )}
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="salons">Select Overview</label>
              <AsyncSelect
                required
                isMulti={true}
                defaultOptions={overviewData}
                options={overviewData}
                value={(formData?.overview || "")
                  .split(",")
                  .map((item) =>
                    overviewData.find((overview) => overview.id == item)
                  )}
                onChange={(selectedOverview) => {
                  setFormData({
                    ...formData,
                    overview: selectedOverview.map((item) => item.id).join(","),
                  });
                }}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id} // Ensure uniqueness
                noOptionsMessage={() => "No overview found"}
                placeholder="Select Overview..."
              />
            </div>
          </div>
          {/* steps */}
          <div className="">
            <div className=" p-2 flex w-full justify-between">
              <strong>Steps</strong>
              <div className="">
                <div
                  className=" bg-blue-800 rounded-md px-3 py-1 text-white min-w-max text-center"
                  // /salons/serivce-detail-step-image/
                  // onclick upload all step images & get urls with promise all
                  onClick={() => {
                    handleStepImageUpload();
                  }}
                >
                  upload all step images
                </div>
              </div>
            </div>
            {steps.map((step, index) => {
              if (!step) return null;
              return (
                <div key={index} className="flex gap-3">
                  <div className=" w-fit px-2 min-w-max">Step {step.step}.</div>
                  <div className="input-box inp-id col-1 col-2 grow">
                    <label htmlFor="instruction">Instruction</label>
                    <textarea
                      name="instruction"
                      id="instruction"
                      placeholder="Enter Instruction"
                      value={step.instruction || ""}
                      onChange={(e) => {
                        setSteps(prev => {
                          const newSteps = [...prev];
                          newSteps[index] = {...newSteps[index], instruction: e.target.value};
                          return newSteps;
                        });
                      }}
                      className=" min-w-[200px]"
                    ></textarea>
                  </div>
                  <div className="input-box inp-main-img col-1 col-2">
                    <label htmlFor="stepImg">Step Image</label>
                    <input
                      type="file"
                      name="stepImg"
                      id="stepImg"
                      placeholder="Enter Step Image"
                      accept="image/*"
                      onChange={(e) => {
                        setSteps(prev => {
                          const newSteps = [...prev];
                          newSteps[index] = {
                            ...newSteps[index],
                            image_data: e.target.files[0] || null,
                            image_url: null,
                          };
                          return newSteps;
                        });
                      }}
                      style={{ width: "fit-content", cursor: "pointer" }}
                    />
                  </div>
                  <div
                    className={`w-20 h-20 mx-2 shrink-0 ${step.image_url ? "" : "invisible"
                      }`}
                  >
                    <img
                      src={step.image_url}
                      alt="step image"
                      className="w-20 h-20 object-cover shrink-0 rounded-md"
                    />
                  </div>
                  <div className="items-center flex gap-1">
                    <div
                      onClick={() => moveStepUp(index)}
                      className={`bg-gray-100 rounded-full h-7 w-7 flex items-center justify-center ${index === 0 ? "invisible" : ""
                        }`}
                      disabled={index === 0}
                    >
                      <ArrowUpwardIcon
                        sx={{
                          fontSize: 16,
                        }}
                      />
                    </div>
                    <div
                      onClick={() => moveStepDown(index)}
                      className={`bg-gray-100 rounded-full h-7 w-7 flex items-center justify-center ${index === steps.length - 1 ? "invisible" : ""
                        }`}
                      disabled={index === steps.length - 1}
                    >
                      <ArrowDownwardIcon
                        sx={{
                          fontSize: 16,
                        }}
                      />
                    </div>
                    <div
                      onClick={() => removeStep(index)}
                      className="bg-red-300 rounded-md px-2 py-1 text-red-700 min-w-max text-center text-sm"
                    >
                      Remove
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-center">
              <div
                onClick={() => addStep()}
                className="bg-blue-300 rounded-md px-3 py-1 text-blue-700 min-w-max text-center mt-2"
                disabled={!steps[steps.length - 1]?.instruction?.trim()}
              >
                + Add Step
              </div>
            </div>
          </div>
          {/* faqs */}
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="faqs">FAQs</label>
              <div className="flex flex-col gap-5">
                <div className="flex gap-5">
                  <input
                    type="text"
                    name="question"
                    id="question"
                    placeholder="Question"
                    value={tempQues.que}
                    onChange={(e) => {
                      setTempQues({ ...tempQues, que: e.target.value });
                    }}
                  />
                  <input
                    type="text"
                    name="answer"
                    id="answer"
                    placeholder="Answer"
                    value={tempQues.ans}
                    onChange={(e) => {
                      setTempQues({ ...tempQues, ans: e.target.value });
                    }}
                  />
                  <div
                    onClick={() => {
                      if (tempQues.que === "" || tempQues.ans === "") {
                        toast.error("Please fill all fields");
                        return;
                      }
                      setFormData({
                        ...formData,
                        faqs: [
                          ...formData.faqs,
                          {
                            question: tempQues.que,
                            answer: tempQues.ans,
                          },
                        ],
                      });
                      setTempQues({
                        que: "",
                        ans: "",
                      });
                    }}
                    className=" bg-blue-300 rounded-md px-3 py-1 text-blue-700 min-w-max text-center"
                  >
                    + Add
                  </div>
                </div>
                <div className="flex gap-2 flex-col">
                  {formData.faqs.map((faq, index) => (
                    <div key={index} className="flex gap-5">
                      <p>
                        <strong>{index + 1}. </strong>
                      </p>
                      <p className=" grow">
                        {" "}
                        <strong>Que: </strong> {faq.question}
                      </p>
                      <p className=" grow">
                        {" "}
                        <strong>Ans: </strong> {faq.answer}
                      </p>
                      <p>
                        <div
                          onClick={() => {
                            setFormData({
                              ...formData,
                              faqs: formData.faqs.filter(
                                (item, i) => i !== index
                              ),
                            });
                          }}
                          className="bg-red-300 rounded-md px-3 py-1 text-red-700 min-w-max text-center text-sm ml-auto"
                        >
                          Remove
                        </div>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* do's & don't */}
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="do">Do's</label>
              <div className="flex gap-5">
                <input
                  type="text"
                  name="do"
                  id="do"
                  placeholder="Do"
                  value={tempDos}
                  onChange={(e) => {
                    setTempDos(e.target.value);
                  }}
                />
                <div
                  onClick={() => {
                    if (tempDos === "") {
                      toast.error("Please fill all fields");
                      return;
                    }
                    setFormData({
                      ...formData,
                      dos: [...formData.dos, tempDos],
                    });
                    setTempDos("");
                  }}
                  className=" bg-blue-300 rounded-md px-3 py-1 text-blue-700 min-w-max text-center"
                >
                  + Add
                </div>
              </div>
              <div className="flex gap-2 flex-col mt-3">
                {formData.dos.map((doItem, index) => (
                  <div key={index} className="flex gap-5">
                    <p>
                      <strong>{index + 1}. </strong>
                    </p>
                    <p className=" grow">{doItem}</p>
                    <p>
                      <div
                        onClick={() => {
                          if (index === 0) return;
                          const temp = formData.dos[index];
                          formData.dos[index] = formData.dos[index - 1];
                          formData.dos[index - 1] = temp;
                          setFormData({ ...formData });
                        }}
                        className={`bg-gray-100 rounded-full h-7 w-7 flex items-center justify-center ${index === 0 ? "invisible" : ""
                          }`}
                        disabled={index === 0}
                      >
                        <ArrowUpwardIcon
                          sx={{
                            fontSize: 16,
                          }}
                        />
                      </div>
                    </p>
                    <p>
                      <div
                        onClick={() => {
                          if (index === formData.dos.length - 1) return;
                          const temp = formData.dos[index];
                          formData.dos[index] = formData.dos[index + 1];
                          formData.dos[index + 1] = temp;
                          setFormData({ ...formData });
                        }}
                        className={`bg-gray-100 rounded-full h-7 w-7 flex items-center justify-center ${index === formData.dos.length - 1 ? "invisible" : ""
                          }`}
                        disabled={index === formData.dos.length - 1}
                      >
                        <ArrowDownwardIcon
                          sx={{
                            fontSize: 16,
                          }}
                        />
                      </div>
                    </p>
                    <p>
                      <div
                        onClick={() => {
                          setFormData({
                            ...formData,
                            dos: formData.dos.filter((item, i) => i !== index),
                          });
                        }}
                        className="bg-red-300 rounded-md px-2 py-1 text-red-700 min-w-max text-center text-sm"
                      >
                        Remove
                      </div>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="dont">Don'ts</label>
              <div className="flex gap-5">
                <input
                  type="text"
                  name="dont"
                  id="dont"
                  placeholder="Don't"
                  value={tempDonts}
                  onChange={(e) => {
                    setTempDonts(e.target.value);
                  }}
                />
                <div
                  onClick={() => {
                    if (tempDonts === "") {
                      toast.error("Please fill all fields");
                      return;
                    }
                    setFormData({
                      ...formData,
                      donts: [...formData.donts, tempDonts],
                    });
                    setTempDonts("");
                  }}
                  className=" bg-blue-300 rounded-md px-3 py-1 text-blue-700 min-w-max text-center"
                >
                  + Add
                </div>
              </div>
              <div className="flex gap-2 flex-col mt-3">
                {formData?.donts?.map((dontItem, index) => (
                  <div key={index} className="flex gap-5">
                    <p>
                      <strong>{index + 1}. </strong>
                    </p>
                    <p className="grow">{dontItem}</p>
                    <p>
                      <div
                        onClick={() => {
                          if (index === 0) return;
                          const temp = formData.donts[index];
                          formData.donts[index] = formData.donts[index - 1];
                          formData.donts[index - 1] = temp;
                          setFormData({ ...formData });
                        }}
                        className={`bg-gray-100 rounded-full h-7 w-7 flex items-center justify-center ${index === 0 ? "invisible" : ""
                          }`}
                        disabled={index === 0}
                      >
                        <ArrowUpwardIcon
                          sx={{
                            fontSize: 16,
                          }}
                        />
                      </div>
                    </p>
                    <p>
                      <div
                        onClick={() => {
                          if (index === formData.donts.length - 1) return;
                          const temp = formData.donts[index];
                          formData.donts[index] = formData.donts[index + 1];
                          formData.donts[index + 1] = temp;
                          setFormData({ ...formData });
                        }}
                        className={`bg-gray-100 rounded-full h-7 w-7 flex items-center justify-center ${index === formData.donts.length - 1 ? "invisible" : ""
                          }`}
                        disabled={index === formData.donts.length - 1}
                      >
                        <ArrowDownwardIcon
                          sx={{
                            fontSize: 16,
                          }}
                        />
                      </div>
                    </p>
                    <p>
                      <div
                        onClick={() => {
                          setFormData({
                            ...formData,
                            donts: formData.donts.filter(
                              (item, i) => i !== index
                            ),
                          });
                        }}
                        className="bg-red-300 rounded-md px-2 py-1 text-red-700 min-w-max text-center text-sm"
                      >
                        Remove
                      </div>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label>Description Image</label>
              <input
                type="file"
                name="desimg"
                id="DesImg"
                placeholder="Enter Description Image"
                accept="image/*"
                onChange={(e) => setDesImg(e.target.files[0])}
                style={{ width: "fit-content", cursor: "pointer" }}
              />
            </div>
          </div>
          {(formData.salon_type === "PRIME" ||
            formData.salon_type === "LUXURIOUS") && (
              <div className="row">
                <div className="input-box inp-main-img col-1 col-2">
                  <label>Key Ingredient Image</label>
                  <input
                    type="file"
                    name="keyIngredientImg"
                    id="keyIngredientImg"
                    placeholder="Enter Key Ingredient Image"
                    accept="image/*"
                    onChange={(e) => setKeyIngredientImg(e.target.files[0])}
                    style={{ width: "fit-content", cursor: "pointer" }}
                  />
                </div>
              </div>
            )}
          {(formData.salon_type === "PRIME" ||
            formData.salon_type === "LUXURIOUS") && (
              <div className="row">
                <div className="input-box inp-main-img col-1 col-2">
                  <label>Things Salon Use Image</label>
                  <input
                    type="file"
                    name="thingsSalonUseImg"
                    id="thingsSalonUseImg"
                    placeholder="Enter Things Salon Use Image"
                    accept="image/*"
                    onChange={(e) => setThingsSalonUseImg(e.target.files[0])}
                    style={{ width: "fit-content", cursor: "pointer" }}
                  />
                </div>
              </div>
            )}
          {formData.salon_type === "LUXURIOUS" && (
            <div className="row">
              <div className="input-box inp-main-img col-1 col-2">
                <label>LUXURIOUS Exprience Image</label>
                <input
                  type="file"
                  name="luxExprienceImg"
                  id="luxExprienceImg"
                  placeholder="Enter Lux Exprience Image"
                  accept="image/*"
                  onChange={(e) => setLuxExprienceImg(e.target.files[0])}
                  style={{ width: "fit-content", cursor: "pointer" }}
                />
              </div>
            </div>
          )}
          {formData.salon_type === "LUXURIOUS" && (
            <div className="row">
              <div className="input-box inp-main-img col-1 col-2">
                <label>Benefit Meta Info Image</label>
                <input
                  type="file"
                  name="benefitMetaInfoImg"
                  id="benefitMetaInfoImg"
                  placeholder="Enter Benefit Meta Info Image"
                  accept="image/*"
                  onChange={(e) => setBenefitMetaInfoImg(e.target.files[0])}
                  style={{ width: "fit-content", cursor: "pointer" }}
                />
              </div>
            </div>
          )}
          {formData.salon_type === "LUXURIOUS" && (
            <div className="row">
              <div className="input-box inp-main-img col-1 col-2">
                <label>Aftercare Tips Image</label>
                <input
                  type="file"
                  name="aftercareTipsImg"
                  id="aftercareTipsImg"
                  placeholder="Enter Aftercare Tips Image"
                  accept="image/*"
                  onChange={(e) => setAftercareTipsImg(e.target.files[0])}
                  style={{ width: "fit-content", cursor: "pointer" }}
                />
              </div>
            </div>
          )}
          {(formData.salon_type === "PRIME" ||
            formData.salon_type === "LUXURIOUS") && (
              <div className="row">
                <div className="input-box inp-main-img col-1 col-2">
                  <label>Main Swiper Images</label>
                  <input
                    type="file"
                    multiple
                    name="mainSwiperImg"
                    id="mainSwiperImg"
                    placeholder="Enter Main Swiper Images"
                    accept="image/*"
                    onChange={(e) => setMainSwiperImg(e.target.files)}
                    style={{ width: "fit-content", cursor: "pointer" }}
                  />
                </div>
              </div>
            )}
          <div className="submit-btn row">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};
export default AddServiceDetails;