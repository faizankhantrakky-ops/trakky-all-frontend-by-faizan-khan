import React from "react";
import { capitalizeAndFormat } from "../../../functions/generalFun";
import { Link, useParams } from "react-router-dom";
import top_rated_image from "../../../../Assets/images/category/top_rated_image.jpg";
import bridal_image from "../../../../Assets/images/category/bridal_image.jpg";
import unisex_image from "../../../../Assets/images/category/unisex_image.jpg";
import kids_image from "../../../../Assets/images/category/kids_special.jpg";
import female_image from "../../../../Assets/images/category/female_beauty_paurlor.jpg";
import male_image from "../../../../Assets/images/category/male_images.jpg";
import academy_image from "../../../../Assets/images/category/academy_image.jpg";
import makeup_image from "../../../../Assets/images/category/makeup.jpg";

function CheckoutBestCategory() {
  const params = useParams();

  const categories = [
    {
      name: "Top Salons",
      image: top_rated_image,
      link: `/${params?.city}/topratedsalons`,
    },
    {
      name: "Bridal Salons",
      image: bridal_image,
      link: `/${params?.city}/bridalsalons`,
    },
    {
      name: "Unisex Salons",
      image: unisex_image,
      link: `/${params?.city}/unisexsalons`,
    },
    {
      name: "Kids Special Salons",
      image: kids_image,
      link: `/${params?.city}/kidsspecialsalons`,
    },
    {
      name: "Female Beauty Parlours",
      image: female_image,
      link: `/${params?.city}/femalebeautyparlour`,
    },
    {
      name: "Male Salons",
      image: male_image,
      link: `/${params?.city}/malesalons`,
    },
    {
      name: "Salon Academy",
      image: academy_image,
      link: `/${params?.city}/academysalons`,
    },
    {
      name: "Makeup Salons",
      image: makeup_image,
      link: `/${params?.city}/makeupsalons`,
    },
  ];

  return (
    <div className="mt-4 lg:mt-10">
      <div className="mx-4 flex justify-between md:mx-10">
        <h1 className="text-xl font-semibold">
          Checkout best salon categories
        </h1>
      </div>

      <div className="ml-4 py-4 flex gap-5 overflow-x-scroll snap-x snap-mandatory md:ml-10 custom-scrollbar">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={category.link}
            className="relative flex flex-col snap-start last:mr-4 rounded-2xl shrink-0 h-44 w-36 bg-gray-200 overflow-hidden group"
          >
            {/* Full Image */}
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Gradient Overlay – Bottom to Top (fade up) */}
            <div
              className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-b-2xl"
              style={{
                // Ensures only bottom corners are rounded
                borderBottomLeftRadius: "1rem",
                borderBottomRightRadius: "1rem",
              }}
            ></div>

            {/* Text Content – At the Bottom */}
            <div className="absolute bottom-2 left-2 right-2 z-10 text-white">
              {/* Category Name */}
              <h3 className="text-md font-bold leading-tight drop-shadow-lg">
                {category.name}
              </h3>
              {/* City Name */}
              <p className="text-xs font-medium drop-shadow-md mt-0.5">
                in {capitalizeAndFormat(params?.city)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}

export default CheckoutBestCategory;