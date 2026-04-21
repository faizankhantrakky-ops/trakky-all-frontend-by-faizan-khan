import React, { memo } from "react";
import { FiChevronRight } from "react-icons/fi";

const LazyOfferCards = memo(
  ({ primaryOfferData, navigate, setShowAllOffersModal }) => (
    <>
      <div className="protected grid grid-cols-2 gap-[15px] my-6 px-[20px] esm:grid-cols-4 md:max-w-[min(550px,70%)] md:mx-auto lg:max-w-[750px] lg:mt-5 lg:mb-8">
        {primaryOfferData.slice(0, 4).map((item, index) => (
          <div
            key={index}
            className="protected aspect-square bg-white rounded-xl shadow-sm drop-shadow-sm cursor-pointer"
            onClick={() => {
              if (item?.salon.length === 1) {
                navigate(
                  `/${item?.city}/${item?.area}/salons/${
                    item?.salon_slug[item?.salon[0]]
                  }`
                );
              } else if (item?.salon.length > 1) {
                navigate(`/${item?.city}/salons/special-offers/${item?.slug}`);
              }
            }}
          >
            <img
              src={item?.offer_image}
              className="h-full w-full aspect-square rounded-xl"
              alt="Best Offers Available For You"
            />
          </div>
        ))}
      </div>

      {primaryOfferData.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAllOffersModal(true)}
            className="text-purple-600 text-sm font-medium flex items-center px-4 py-2 border-2 border-gradient-to-r from-[#AE86D0] to-[#512DC8] rounded-full hover:bg-purple-50 transition-colors ring-2 ring-purple-300 ring-offset-2 focus:outline-none focus:ring-purple-500"
          >
            View more special offers <FiChevronRight className="ml-1" />
          </button>
        </div>
      )}
    </>
  )
);

export default LazyOfferCards;
