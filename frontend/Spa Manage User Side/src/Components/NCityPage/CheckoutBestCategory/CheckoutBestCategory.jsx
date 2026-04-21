import React from "react";
import { capitalizeAndFormat } from "../../functions/generalFun";
import { Link, useParams } from "react-router-dom";
import bestSpaSvg from "../../../Assets/images/cateogry/bestspa.png";
import topRatedSpaSvg from "../../../Assets/images/cateogry/topratedspa.png";
import luxuriousSpaSvg from "../../../Assets/images/cateogry/luxuriousspa.png";
import beautySpaSvg from "../../../Assets/images/cateogry/Beauty_spa.png";
import bodyMassageSpaSvg from "../../../Assets/images/cateogry/body_massage_spa.png";
import bodyMassageCenterSvg from "../../../Assets/images/cateogry/body_massage_center.png";
import mensSpaSvg from "../../../Assets/images/cateogry/mensspa.png";
import womensSpaSvg from "../../../Assets/images/cateogry/womensspa.png";
import thaiBodyMassageSvg from "../../../Assets/images/cateogry/thaibodymassage.png";


function CheckoutBestCategory() {

  const params = useParams();

  const categories = [
   
    {
      name: "Best Spas",
      image: bestSpaSvg,
      link: `/${params?.city}/bestspas`
    },
    {
      name: "Top Rated Spas",
      image: topRatedSpaSvg,
      link: `/${params?.city}/topratedspas`
    },
    {
      name: "Luxurious Spas",
      image: luxuriousSpaSvg,
      link: `/${params?.city}/luxuriousspas`
    },
    {
      name: "Beauty Spas",
      image: beautySpaSvg,
      link: `/${params?.city}/beautyspas`
    },
    {
      name: "Body Massage Spas",
      image: bodyMassageSpaSvg,
      link: `/${params?.city}/bodyMassagespas`
    },
    {
      name: "Body Massage Centers",
      image: bodyMassageCenterSvg,
      link: `/${params?.city}/bodyMassagecenter`
    },
    {
      name: "Men's Spas",
      image: mensSpaSvg,
      link: `/${params?.city}/menspas`
    },
    {
      name: "Women's Spas",
      image: womensSpaSvg,
      link: `/${params?.city}/womenspas`
    },
    {
      name: "Thai Body Massage",
      image: thaiBodyMassageSvg,
      link: `/${params?.city}/thaimassage`
    }
    ]

  return (
    <div className="mt-6 lg:mt-10">
      <div className="mx-4 flex justify-between md:mx-10">
        <h2 className="text-xl font-semibold">
          Checkout best spa categories
        </h2>
      </div>
      <div className="ml-4 py-4 flex gap-4 overflow-x-scroll snap-x snap-mandatory md:ml-10">
        {categories.map((category, index) => (
          <Link to={category.link} className="flex relative flex-col gap-4 snap-start last:mr-4 rounded-2xl shadow-sm drop-shadow-sm shrink-0 h-44 w-36 bg-gray-200">
            <div className=" absolute bottom-0 left-0 pl-2 pb-2 bg-gradient-to-t from-[#000000d4] rounded-b-2xl pt-3 to-[#00000000]  text-sm font-semibold text-white">
              {
                category.name + ` in ${capitalizeAndFormat(params?.city)}`
              }
            </div>
            <img src={category.image} className="h-full w-full rounded-2xl" alt="category" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CheckoutBestCategory;
