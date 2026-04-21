import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const OfferComponentN = ({ title, area }) => {
  const [offersData, setOffersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const params = useParams();

  const city = params?.city;
  const getOffer = () => {
    let url = `https://backendapi.trakky.in/salons/offer/?city=${city}`;

    if (area) {
      url += `&area=${area}`;
    }

    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, requestOption)
      .then((res) => res.json())
      .then((data) => {
        setOffersData(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getOffer();
  }, [params?.city, area]);

  return (
    <div className="md:pb-3">
      {offersData?.length >= 1 && (
        <div className=" text-lg md:text-xl font-bold ml-[15px] pt-5 pb-3 md:ml-10 md:pt-8 clg:max-w-[1360px] clg:mx-auto clg:pt-10">
          {title}
        </div>
      )}
      <div className="max-w-full ml-[15px] md:ml-10 clg:ml-[calc((100vw-1360px)/2)] ">
        <Swiper
          spaceBetween="20"
          slidesPerView="auto"
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          //   pagination={{ clickable: true }}
          //   scrollbar={{ draggable: true }}
          className=""
        >
          {offersData
            ?.filter((item) => item.slug !== params?.slug)
            .map((item, index) => (
              <SwiperSlide
                key={index}
                className="last:mr-[15px] md:last:mr-10 clg:last:mr-[calc((100vw-1360px)/2)]"
              >
                {item.salon.length > 1 ? (
                  <Link
                    to={`/${encodeURIComponent(
                      item.city.toLowerCase()
                    )}/offers/${item.slug}`}
                    className="h-[120px] w-auto block"
                  >
                    <img
                      style={{ borderRadius: "8px" }}
                      src={item?.img_url}
                      className="h-full w-auto object-contain"
                      alt="Exclusive Offers Available"
                    />
                  </Link>
                ) : (
                  <Link
                    to={`/${item?.city}/${item?.area}/salons/${
                      item?.salon_slugs[item?.salon[0]]
                    }/`}
                    className="h-[120px] w-auto block "
                  >
                    <img
                      style={{ borderRadius: "8px" }}
                      src={item?.img_url}
                      className="h-full w-auto object-contain"
                      alt="Exclusive Offers Available"
                    />
                  </Link>
                )}
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default OfferComponentN;
