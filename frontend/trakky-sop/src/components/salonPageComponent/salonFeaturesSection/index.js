"use client";
import React, { useState } from "react";
import Icon from "../../icon";
import Image from "next/image";
import { SalonFeaturesData } from "@/mock/data";

const SalonFeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="relative w-full py-10 xl:py-20 bg-white flex justify-center items-center px-8 xl:px-0">
      <div className="max-w-[1200px] w-full flex flex-col items-center text-center gap-y-14">

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          Tools Designed for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E38D1] to-[#9D7FF5]">
            Salons
          </span>
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl">
          Running a salon is easier with the right tools. Trakky provides salon
          software solutions tailored for Indian salons
        </p>

        {/* Grid for Equal Base Height */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {SalonFeaturesData.map((feature, idx) => (
            <div
              key={idx}
              className={`group relative rounded-3xl shadow-xl bg-white border border-[#E0DDF3] transition-all duration-500 cursor-pointer
                hover:border-[#5E38D1] hover:shadow-2xl 
                ${hoveredIndex === idx ? "ring-4 ring-[#5E38D1]/20 z-10" : ""}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#5E38D1]/5 to-[#9D7FF5]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

              {/* Main Content */}
              <div className="relative p-8 flex flex-col items-center gap-y-5">
                <div className="w-16 h-16 flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#b5accf8f] via-[#ab97e3] to-[#A088F7] shadow-lg group-hover:shadow-xl transition-shadow">
                  <Icon icon={feature.icon} width={32} height={32} className="text-white" />
                </div>

                <h3 className="text-2xl font-semibold text-[#5E38D1] group-hover:-105 transition-transform">
                  {feature.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  {feature.desc}
                </p>

                <div className="w-full h-[300px] relative  overflow-hidden mt-4   ring-2 ring-transparent group-hover:ring-[#5E38D1]/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5E38D1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <Image
                    src={feature.img}
                    alt={feature.title}
                    fill
                    className="object-contain transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Expandable Details - Andar Hi, Smooth Slide */}
              <div
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                  maxHeight: hoveredIndex === idx ? "500px" : "0px",
                  paddingTop: hoveredIndex === idx ? "24px" : "0px",
                  paddingBottom: hoveredIndex === idx ? "32px" : "0px",
                }}
              >
                <div className="px-8">
                  <div className="h-0.5 bg-gradient-to-r from-[#5E38D1] to-[#9D7FF5] mb-6" />
                  <ul className="space-y-4 text-gray-700 text-sm">
                    {feature.details.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-[#5E38D1] to-[#9D7FF5] mt-1" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SalonFeaturesSection;