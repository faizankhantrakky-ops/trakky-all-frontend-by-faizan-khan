import React from "react";
import "./spaprofilemodal.css";
import { IoMdClose } from "react-icons/io";

const OfferSpaModal = ({ data, handleClose, spa }) => {
  const handleBookNowBtn = (name, price) => {
    if (!spa?.name) {
      return;
    }

    let message = `Can you provide more details about the special offer named '${name}' at ${spa?.name} in ${spa?.area}, ${spa?.city}? It comes with a discounted price of ${price} rupees.`;

    let link = `https://api.whatsapp.com/send?phone=916355167304&text=${encodeURIComponent(
      message
    )}`;

    window.open(link, "_blank");
  };

  return (
    <>
      <div className="SPO-M-Modal-main-container">
        <div className="SPO-M-close-btn">
          <div className="button" onClick={handleClose}>
            <IoMdClose
              sx={{
                height: "30px",
                width: "30px",
              }}
            />
          </div>
        </div>
        <div className="SPO-details">
          <div className="SPO-Title-header text-center !font-semibold">
            Offer Details
          </div>
          {data?.offer_type == "massage specific" ? (
            <>
              <div className="SPO-SPO-M-meta-info">
                <div className="SPO-Mm-info-offer">
                  <h2 className="text-[20px] font-semibold ">
                    {data?.offer_name}
                  </h2>
                </div>
                <div className="flex justify-between OSM-price-cart">
                  <div>
                    <del>₹{data?.massage_price}</del>
                    <div className="text-[18px] font-medium pl-1">
                      ₹{data?.discount_price} only
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleBookNowBtn(data?.offer_name, data?.discount_price);
                    }}
                  >
                    {/* Add to cart */}
                    Book Now
                  </button>
                </div>
              </div>
              <div className="SPO-offer-desc !pt-2">
                <h2 className=" font-semibold text-center text-[18px] mb-2 mt-0">
                  Terms & conditions
                </h2>

                <div
                  dangerouslySetInnerHTML={{
                    __html: data?.term_and_condition,
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div className=" border-b border-slate-200 px-4">
                <h2 className="text-[20px] font-semibold flex items-center h-20">
                  {data?.offer_name}
                </h2>
              </div>
                <div className="SPO-offer-desc !pt-2">
                <h2 className=" font-medium text-base mb-2 mt-0">
                  Terms & conditions
                </h2>

                <div
                  dangerouslySetInnerHTML={{
                    __html: data?.term_and_condition,
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OfferSpaModal;
