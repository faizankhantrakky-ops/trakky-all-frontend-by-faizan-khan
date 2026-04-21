import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../../../Store/categorySlice";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { capitalizeAndFormat } from "../../../functions/generalFun";
import { useNavigate } from "react-router-dom";

function Salonservices() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const categoryState = useSelector((state) => state.categories);

  useEffect(() => {
    if (
      categoryState?.city == null ||
      categoryState.city.toLowerCase() != params.city.toLowerCase()
    ) {
      dispatch(fetchCategories({ city: params.city }));
    }
  }, [params.city, dispatch]);

  return (
    categoryState?.loading || categoryState?.data?.length > 0 && (
      <div className="mt-4 lg:mt-10">
        <div className="mx-4 flex justify-between md:mx-10">
          <h1 className="text-xl font-semibold">
            Salon services in {capitalizeAndFormat(params?.city)}
          </h1>
        </div>
        <div className="ml-4 py-4 flex gap-5 overflow-x-scroll snap-x snap-mandatory md:ml-10">
          {Array.from({ length: categoryState?.data?.length / 2 }, (_, index) => (
            <div className="flex flex-col gap-4 snap-start last:mr-4 lg:flex-row">
              {categoryState?.data
                ?.slice(index * 2, index * 2 + 2)
                .map((category, index) => (
                  <div
                    className="flex flex-col gap-1 lg:gap-3 cursor-pointer"
                    onClick={() => {
                      navigate(`/${params.city}/categories/${category?.slug}`);
                    }}
                  >
                    <div className=" bg-gray-200 h-28 w-28 rounded-full lg:h-32 lg:w-32">
                      {category?.category_image && (
                        <img
                          src={category?.category_image}
                          alt={category?.name}
                          className="h-full w-full object-cover rounded-full drop-shadow shadow blur-[0.15px]"
                        />
                      )}
                    </div>
                    <div className="text-center line-clamp-1 text-sm">
                      {category?.name}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    ));
}

export default Salonservices;
