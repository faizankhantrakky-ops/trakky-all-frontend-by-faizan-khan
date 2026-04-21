"use client";
import React from "react";
import { motion } from "framer-motion";
import { UseCasesSalonPageData } from "@/mock/data";
import Icon from "../../icon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";

// -----------------------------------------------

const SalonUseCaseSection = () => {

    const useCases = UseCasesSalonPageData;

    return (
        <>
            <section className="relative w-full py-10 lg:py-24 bg-gradient-to-br from-white via-purple-50/20 to-white overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-16 left-16 w-80 h-80 bg-purple-100/10 rounded-full blur-3xl" />
                <div className="absolute bottom-16 right-16 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Heading */}
                    <div className="text-center pb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="inline-block mb-8 px-5 py-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full"
                        >
                            <span className="text-sm font-semibold text-purple-700">
                                USE CASES
                            </span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8"
                        >
                            Perfect for Every{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-500">
                                Salon & Beauty Business
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-lg text-gray-600 max-w-4xl mx-auto"
                        >
                            Trakky seamlessly adapts to salons, spas, and beauty clinics of all sizes. Easily manage treatments, track expenses, handle staff schedules, and deliver personalized client experiences that keep customers coming back.
                        </motion.p>
                    </div>

                    {/* Swiper Carousel */}
                    <div className="relative max-w-6xl mx-auto">
                        <Swiper
                            modules={[Autoplay, Navigation, Pagination]}
                            spaceBetween={40}
                            slidesPerView={1}
                            navigation={{
                                nextEl: ".swiper-button-next-custom",
                                prevEl: ".swiper-button-prev-custom",
                            }}
                            pagination={{
                                el: ".swiper-pagination-custom",
                                clickable: true,
                            }}
                            autoplay={{ delay: 2000, disableOnInteraction: false }}
                            loop
                        >
                            {useCases.map((item, idx) => (
                                <SwiperSlide key={item.id}>
                                    <motion.div
                                        // initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        viewport={{ once: true }}
                                        className="group relative bg-white rounded-3xl overflow-hidden border border-purple-100 hover:border-purple-600 transition-all duration-500 mx-auto max-w-2xl hover:scale-[1.02]"
                                    >
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-transparent to-purple-400/0 group-hover:from-purple-100/20 group-hover:to-purple-300/20 transition-all duration-500 pointer-events-none z-10" />

                                        {/* Image Section */}
                                        <div className="relative h-80 w-full overflow-hidden rounded-t-3xl">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
                                            <Image
                                                width={300}
                                                height={300}
                                                src={item.img}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-5 left-5 z-20 w-16 h-16 bg-white rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                                                <Icon icon={item?.icon} className="text-4xl" />
                                            </div>
                                            <div className="absolute top-5 right-5 z-20 w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">{idx + 1}</span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="relative p-8 flex flex-col space-y-4">
                                            <h3 className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 text-base leading-relaxed">{item.desc}</p>
                                            <Link href={"/schedule-demo"} className="w-fit">
                                                <button className="relative mt-4 self-start px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold overflow-hidden group/btn transition-all duration-300 hover:scale-105">
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        Learn More
                                                        <svg
                                                            className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                                </button>
                                            </Link>
                                        </div>

                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Navigation Buttons */}
                        <div className="swiper-button-prev-custom hidden absolute lg:left-[50px] left-[-12px] top-1/2 -translate-y-1/2 z-20 md:w-8 md:h-8 lg:w-12 lg:h-12 bg-purple-600/80 hover:bg-purple-600 text-white rounded-full md:flex items-center justify-center cursor-pointer shadow-lg">
                            <Icon
                                height={40}
                                width={40}
                                icon={"material-symbols-light:arrow-left-rounded"} />
                        </div>
                        <div className="swiper-button-next-custom absolute lg:right-[50px] right-[-12px] top-1/2 -translate-y-1/2 hidden z-20 md:w-8 md:h-8 lg:w-12 lg:h-12 bg-purple-600/80 hover:bg-purple-600 text-white rounded-full md:flex items-center justify-center cursor-pointer shadow-lg">
                            <Icon
                                height={40}
                                width={40}
                                icon={"material-symbols-light:arrow-right-rounded"} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SalonUseCaseSection;
