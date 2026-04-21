import React from "react";
import { useState, useEffect } from "react";
import AuthContext from "../../../context/Auth";
import "./service.css";

const Services = (props) => {
  const { user } = React.useContext(AuthContext);
  const [visibleServices, setVisibleServices] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [msg, setMsg] = useState("");


  const [triggerScroll, setTriggerScroll] = useState(false);

  useEffect(() => {
    setVisibleServices(5);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      setVisibleServices(props?.serviceData?.length);
    } else {
      setVisibleServices(5);
    }
  }, [isExpanded]);

  const toggleScroll = () => {
    setIsExpanded(!isExpanded);
  };

  const { location } = React.useContext(AuthContext);

 const handleBookNowBtn = (item) => {
  // Safety checks
  if (!props.spa?.name || !props.spa?.mobile_number) {
    alert("Cannot book right now — spa contact information is missing.");
    return;
  }

  // Prepare dynamic WhatsApp number (most common Indian format)
  const rawNumber = String(props.spa.mobile_number).trim();
  const cleanNumber = rawNumber.replace(/\D/g, ''); // remove everything except digits
  const whatsappNumber = cleanNumber.startsWith('91')
    ? cleanNumber
    : `91${cleanNumber}`;

  // Build the message
  let message = `I want to book the ${item?.service_names || 'service'}`;

  if (props.spa?.name) {
    message += ` available at ${props.spa.name}`;
  }

  if (props.spa?.area || props.spa?.city) {
    message += ` in ${[props.spa?.area, props.spa?.city]
      .filter(Boolean)
      .join(', ')}`;
  }

  message += '.\n\n';

  if (item?.discount) {
    message += `As mentioned, it comes with **discounted price** of ₹${item.price}`;
  } else {
    message += `It comes with price of ₹${item.price}`;
  }

  if (item?.service_time) {
    message += ` and takes ${formateTime(item.service_time)} to complete.\n\n`;
  } else {
    message += '.\n\n';
  }

  message += 'Please book it for me.';

  // Create WhatsApp link
  const encodedMessage = encodeURIComponent(message);
  const waLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

  // Open in new tab
  window.open(waLink, '_blank', 'noopener,noreferrer');
};

  // const log_adder = async (name) => {
  //   const requestBody = {
  //     category: "spa",
  //     name: name,
  //     location,
  //   };

  //   if (user != null) {
  //     requestBody.salon_user = user?.user_id || null;
  //   }

  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(requestBody),
  //   };

  //   try {
  //     const response = await fetch(
  //       "https://backendapi.trakky.in/salons/log-entry/",
  //       requestOptions
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to log entry");
  //     }

  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Error logging entry:", error.message);
  //   }
  // };

  const formateTime = (time) => {
    let str = "";

    if (time?.days && time?.days != 0) {
      str += time.days + " Days, ";
    }
    if (time?.seating && time?.seating != 0) {
      str += time.seating + " Seating, ";
    }
    if (time?.hours && time?.hours != 0) {
      str += time.hours + " Hours, ";
    }
    if (time?.minutes && time?.minutes != 0) {
      str += time.minutes + " Minutes, ";
    }

    str = str.slice(0, -2);

    return str;
  };

  useEffect(() => {
    setIsExpanded(false);
  }, [props?.serviceData]);

  useEffect(() => {

    console.log("targetServiceId", props?.targetServiceId?.id);

    let serviceItem = document.getElementById(`service-item-${props?.targetServiceId?.id}`);

    if (serviceItem) {
      serviceItem.scrollIntoView({ behavior: "smooth" });
    }
    if (!serviceItem && props?.targetServiceId?.id) {
      let isExist = props?.serviceData.find((item) => item.id === props?.targetServiceId?.id);
      if (isExist) {
        setVisibleServices(props?.serviceData?.length);
        setIsExpanded(true);
        setTriggerScroll(true);
      }
    }

  } , [props?.targetServiceId])

  useEffect(() => {

    if (triggerScroll && props?.targetServiceId?.id) {
      let serviceItem = document.getElementById(`service-item-${props?.targetServiceId?.id}`);
      if (serviceItem) {
        serviceItem.scrollIntoView({ behavior: "smooth" });
      }

      setTriggerScroll(false);
    }

  }, [triggerScroll])

  //AE86D0 512DC8

  // scroll spy

  //   const handleScroll = () => {
  //     // check service in viewport
  //     let serviceItems = document.querySelectorAll(".N-Main-Service-Item");
  //     let serviceItemsArray = Array.from(serviceItems);
  //     let viewportItem = [];

  //     serviceItemsArray.forEach((item) => {
  //       let rect = item.getBoundingClientRect();
  //       if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
  //         viewportItem.push(item.getAttribute("data-service-cateogry"));
  //       }
  //     });

  //     console.log("viewportItem", viewportItem[0]);

  //   };

  //   let lastScrollPosition = 0;
  // function debouncedHandleScroll() {
  //  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  //  const scrollDifference = Math.abs(currentScrollPosition - lastScrollPosition);

  //  if (scrollDifference >= 10) {
  //     handleScroll();
  //     lastScrollPosition = currentScrollPosition;
  //  }
  // }

  //   useEffect(() => {

  //     window.addEventListener("scroll", debouncedHandleScroll);
  //     return () => {
  //       window.removeEventListener("scroll", debouncedHandleScroll);
  //     };

  //   }, []);

  return (
    <div>
      {props?.serviceData?.length > 0 ? (
        <div className={`w-[100%]`}>
          <div className="N-Service-main-container">
            {props?.serviceData
              ?.slice(0, visibleServices)
              .map((item, index) => {
                return (
                  <div
                    className="N-Main-Service-Item"
                    data-service-cateogry={item?.categories}
                    id = {`service-item-${item?.id}`}
                  >
                    <div className="N-Service-Image-Div">
                      <div className="N-Service-Image-container">
                        {item?.service_image && (
                          <img src={item.service_image} alt="service" />
                        )}
                      </div>
                      <button
                        className="N-Service-call-now-btn-md"
                        onClick={() => {
                          handleBookNowBtn(item);
                        }}
                      >
                        {/* <a
                          href={`tel:${props.mobile_number}`}
                          onClick={() => log_adder(props.salonname)}
                        >
                          Book Now
                      </a> */}
                        Book now
                      </button>
                    </div>
                    <div className="N-Service-Content-Div">
                      <div className="N-Service-Title-Div">
                        {item?.service_names}
                      </div>
                      <div className="N-Service-Description-Div">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item?.description,
                          }}
                        />
                      </div>
                      <div className="N-Service-price-book-Div">
                        <div className="N-Service-pricing-Div">
                          {item?.discount > 0 ? (
                            <>
                              <span className="N-s-p-d-actual-p">
                                ₹{item?.discount}
                              </span>
                              <span className=" pl-[6px] text-gray-500 flex">
                                ₹
                                <del>
                                  <span>{item?.price}</span>
                                </del>
                              </span>
                            </>
                          ) : (
                            <span className="N-s-p-d-actual-p">
                              ₹{item?.price}
                            </span>
                          )}
                          <span
                            style={{
                              paddingLeft: "5px",
                              paddingRight: "5px",
                            }}
                          >
                            ●
                          </span>
                          <span
                            style={{
                              color: " #646464",
                            }}
                          >
                            {formateTime(item?.service_time)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {(props?.serviceData.length > visibleServices || isExpanded) && (
            <div className="N-view-more-button-container">
              <button onClick={toggleScroll}>
                {isExpanded ? "View Less" : "See all Services"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-[20px] font-medium h-[100px] w-full flex justify-center items-center">
            We will add menu soon!
          </h2>
        </div>
      )}
    </div>
  );
};

export default Services;
