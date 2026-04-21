"use client";
import React, { useState, useEffect } from "react";
import Icon from "../../icon";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SalonPageHeroSection } from "@/assets";
import Link from "next/link";

// -------------------------------------------

const wordsWithIcons = [
    { word: "Growth" },
    { word: "Success" },
    { word: "Beauty" },
    { word: "Confidence" },
];

// -------------------  ---------------------

const SalonPageHeroComponent = () => {
    const [index, setIndex] = useState(0);

    // Auto change word every 2.5s
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % wordsWithIcons.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="relative w-full min-h-screen flex px-6 lg:px-12 justify-center items-center bg-gradient-to-b from-white to-[#f8f6ff] overflow-hidden">

                {/* Decorative gradient shapes */}
                <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-gradient-to-tr from-[#5E38D1]/20 to-[#C6B7FA]/30 rounded-full blur-[120px]"></div>

                <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-gradient-to-tr from-[#9D7FF5]/30 to-[#5E38D1]/20 rounded-full blur-[100px]"></div>

                {/* Main Content */}
                <div className="relative z-1 max-w-[1200px] pt-52 w-full flex flex-col gap-y-8 lg:gap-y-14 justify-center items-center text-center">

                    {/* Title with Animated Word + Icon */}
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 relative">
                        Unlock
                        <span className="inline-flex gap-x-3 items-center mx-2 lg:mx-4 relative w-fit justify-center">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={wordsWithIcons[index].word}
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -40, opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="flex items-center gap-x-2 text-transparent bg-clip-text bg-gradient-to-r from-[#5E38D1] to-[#9D7FF5] font-extrabold"
                                >
                                    {wordsWithIcons[index].word}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                        with <span className="relative">Trakky  India’s Best Salon Management Software

                        </span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="w-full md:w-[65%] text-center text-gray-600 text-lg"
                    >
                        Simplify your salon management, boost client engagement, and grow your business with Trakky – India’s #1 salon and management software. From online appointments and billing to inventory tracking and staff management.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        <Link href={"/login"}>
                            <button className="px-8 py-3 bg-gradient-to-r from-[#5E38D1] to-[#9D7FF5] text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all">
                                Get Started
                            </button>
                        </Link>
                        <Link href={"/schedule-demo"}>
                            <button className="px-8 py-3 bg-white/80 backdrop-blur-lg border-2 border-[#5E38D1]/50 text-[#5E38D1] font-semibold rounded-full hover:bg-[#f3f0ff] transition-all">
                                Learn More.
                            </button>
                        </Link>
                    </motion.div>


                    <div className="w-full pt-8">
                        <Image
                            width={3000}
                            height={3000}
                            alt="..."
                            className="rounded-t-[1rem] lg:rounded-t-[2rem]"
                            src={SalonPageHeroSection}
                        />
                    </div>
                </div>

            </div>
        </>
    );
};

export default SalonPageHeroComponent;
