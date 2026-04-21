import React from "react";
import Packages_svg from "./../../../../Assets/images/icons/Packages_svg.svg";
import { IoMdClose } from "react-icons/io";

const PackagesModal = ({ handleClose, data }) => {
  const formateTime = (time) => {
    let str = "";

    if (time?.days) {
      str += time.days + " Days, ";
    }
    if (time?.seating) {
      str += time.seating + " Seating, ";
    }
    if (time?.hours) {
      str += time.hours + " Hours, ";
    }
    if (time?.minutes) {
      str += time.minutes + " Minutes, ";
    }

    str = str.slice(0, -2);

    return str;
  };

  return (
    <div className="package-Modal-main-container">
      <div className="package-close-btn">
        <div className="button" onClick={handleClose}>
          <IoMdClose
            sx={{
              height: "30px",
              width: "30px",
            }}
          />
        </div>
      </div>
      <div className="GPM-details">
        <div className="GPM-Title-header">Grooming Package Details</div>
        <div className="GPM-service-desc-details">
          <div className="GPM-service-pac-meta-d">
            <div className="GP-package-image">
              <img src={Packages_svg} alt="" /> PACKAGE
            </div>
            <div className="GP-package-name-book">
              <h2>{data?.package_name}</h2>
              {/* <button>Book Now</button> */}
            </div>
            <div className="GP-package-price-time">
              <span>₹{parseInt(data?.discount_price)}</span>
              <span className=" px-[3px] flex text-gray-500 text-sm">
                ₹
                <del>
                  <span>{parseInt(data?.actual_price)}</span>
                </del>
              </span>

              <span>●</span>
              <span>1hr 30min 2 seating 5 days</span>
            </div>
            <div className="GP-package-service-item-tag">
              <span>Included Services Details :</span>
            </div>
          </div>
          <div className="GP-package-service-item-list">
            {data?.service_included?.map((item, index) => {
              return (
                <div
                  className="N-Main-Service-Item"
                  data-service-cateogry={item?.categories}
                >
                  <div className="N-Service-Image-Div">
                    <div className="N-Service-Image-container">
                      {item?.service_image && <img src={item.service_image} />}
                    </div>
                  </div>
                  <div className="N-Service-Content-Div">
                    <div
                      className="N-Service-Title-Div"
                      style={{
                        fontSize: "16px",
                        paddingBottom: "0",
                      }}
                    >
                      {item?.service_name}
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
                            <span className=" px-[6px] text-gray-500 text-sm flex">
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
        </div>
      </div>
    </div>
  );
};

export default PackagesModal;
