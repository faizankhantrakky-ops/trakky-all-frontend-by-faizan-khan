import React, { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const LazyHeroBanner = memo(({ heroOffer, navigate }) => (
  <Swiper
    slidesPerView="1"
    navigation
    loop={true}
    autoplay={{ delay: 2000, disableOnInteraction: false }}
  >
    {heroOffer.map((item, index) => (
      <SwiperSlide key={index} className="">
        <div
          className="protected h-auto w-full cursor-pointer"
          onClick={() => {
            if (!item?.salon_slug || !item?.salon_city || !item?.salon_area)
              return;
            navigate(
              `/${encodeURIComponent(item?.salon_city)}/${encodeURIComponent(
                item?.salon_area
              )}/salons/${encodeURIComponent(item?.salon_slug)}`
            );
          }}
        >
          <img
            style={{ borderRadius: "11px" }}
            src={item?.image}
            className="h-auto w-full object-contain rounded-lg"
            alt="Exclusive Salon Offers Available For You"
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
));

export default LazyHeroBanner;
