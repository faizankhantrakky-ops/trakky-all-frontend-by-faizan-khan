"use client";
import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import Icon from "../icon";

// -----------------------------------------------

const HowItWorksMobile = ({ steps }) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);

    const onSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex);
    };

    const goPrev = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const goNext = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    return (
        <>
            <div className="min-h-screen justify-center bg-gradient-to-br from-white via-indigo-50 to-indigo-100 flex flex-col items-center p-6 relative overflow-hidden">

                {/* Decorative spa/salon icons */}
                <motion.div
                    className="absolute top-[80px] left-5 text-indigo-300 pointer-events-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <Icon
                        icon={"mdi:spa"}
                        className={"animate-bounce"}
                        width="30"
                        height="30"
                    />
                </motion.div>
                <motion.div
                    className="absolute top-[600px] left-8 text-indigo-300 pointer-events-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <Icon
                        icon={"solar:scissors-broken"}
                        className={"animate-bounce"}
                        width="30"
                        height="30"
                    />
                </motion.div>
                <motion.div
                    className="absolute top-[60px] right-8 text-indigo-300 pointer-events-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <Icon
                        icon={"hugeicons:yoga-01"}
                        className={"animate-bounce"}
                        width="30"
                        height="30"
                    />
                </motion.div>

                <motion.div
                    className="absolute top-[550px] right-[30px] text-indigo-200 pointer-events-none"
                    initial={{ opacity: 0.5, y: 30 }}
                    animate={{ opacity: 0.4, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <Icon
                        className={"animate-bounce"}
                        icon={"mdi:hair-dryer"}
                        width="30"
                        height="30"
                    />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-extrabold text-indigo-900 text-center mb-6"
                >
                    How Trakky Salon Software Works
                </motion.h2>
                <p className="text-indigo-700 text-center text-base max-w-md mb-8">
                    Get started with Trakky in just a few simple steps and transform the way you run your salon. Our all-in-one salon management software makes it easy to handle bookings, staff, payments, and customer relationships so you can focus on growing your business.
                </p>

                <Swiper
                    spaceBetween={40}
                    slidesPerView={1}
                    onSlideChange={onSlideChange}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    className="w-full max-w-md mb-10"
                >
                    {steps.map((step, idx) => (
                        <SwiperSlide key={idx}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 20,
                                }}
                                className="bg-white rounded-3xl p-8 text-center border border-indigo-100"
                            >
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 text-6xl shadow-lg"
                                >
                                    <Icon icon={step.icon} />
                                </motion.div>

                                <motion.h3
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.4 }}
                                    className="text-2xl font-bold text-indigo-900 mb-4"
                                >
                                    {step.title}
                                </motion.h3>

                                <p className="text-indigo-700 text-base leading-relaxed">
                                    {step.desc}
                                </p>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="text-indigo-700 font-semibold text-lg">
                    Step {activeIndex + 1} of {steps.length}
                </div>

                <div className="pt-10 flex justify-center space-x-6 text-indigo-500 select-none">
                    {/* Show Swipe Left only if not on first slide */}
                    {activeIndex > 0 && (
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={goPrev}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') goPrev(); }}
                        >
                            <span className="text-sm font-medium">Swipe Left</span>
                            <div className="w-5 h-5 border-r-2 border-b-2 border-indigo-500 transform rotate-45 animate-bounce" />
                        </div>
                    )}

                    {/* Show Swipe Right only if not on last slide */}
                    {activeIndex < steps.length - 1 && (
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={goNext}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') goNext(); }}
                        >
                            <div className="w-5 h-5 border-l-2 border-b-2 border-indigo-500 transform -rotate-45 animate-bounce" />
                            <span className="text-sm font-medium">Swipe Right</span>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export default HowItWorksMobile;
