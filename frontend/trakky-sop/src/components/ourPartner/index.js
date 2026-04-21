"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import useMediaQuery from '@mui/material/useMediaQuery';
import { OurPartnerLogoData } from "@/mock/data";

// -----------------------------------------------

const OurPartner = () => {

    const [duration, setDuration] = useState(25);
    const [logos] = useState(OurPartnerLogoData);
    const logosRef = useRef(null);
    const [scrollWidth, setScrollWidth] = useState(0);

    // Media queries
    const isXs = useMediaQuery('(max-width:639px)');
    const isSm = useMediaQuery('(min-width:640px) and (max-width:767px)');
    const isMd = useMediaQuery('(min-width:768px) and (max-width:1023px)');
    const isLgUp = useMediaQuery('(min-width:1024px)');

    useEffect(() => {
        if (isXs) {
            setDuration(4);
        } else if (isSm) {
            setDuration(20);
        } else if (isMd) {
            setDuration(25);
        } else if (isLgUp) {
            setDuration(30);
        }
    }, [isXs, isSm, isMd, isLgUp]);

    useEffect(() => {
        if (logosRef.current) {
            setScrollWidth(logosRef.current.scrollWidth / 2);
        }
    }, [logos]);


    return (
        <>
            <section className="w-full bg-gradient-to-br from-gray-50 to-white py-20 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

                <div className="max-w-[1200px] mx-auto px-8 xl:px-0 relative z-10">
                    {/* Heading */}
                    <div className="text-center mb-16">
                        <motion.p
                            viewport={{ once: true }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-3"
                        >
                            Trusted By Industry Leaders
                        </motion.p>
                        <motion.h2
                            viewport={{ once: true }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold text-gray-800"
                        >
                            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Partners</span>
                        </motion.h2>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "80px" }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4 rounded-full"
                        ></motion.div>
                    </div>

                    {/* Partner Logos */}
                    <div className="relative">
                        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
                        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>

                        <div className="overflow-hidden">
                            <motion.div
                                ref={logosRef}
                                className="flex items-center gap-16"
                                animate={{ x: [0, -scrollWidth] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: duration,
                                    ease: "linear",
                                }}
                            >
                                {
                                    [...logos, ...logos].map((logo, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex-shrink-0 group"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="bg-white rounded-2xl p-6 transition-all duration-300 border border-gray-100">
                                                <Image
                                                    width={120}
                                                    height={60}
                                                    src={logo.src}
                                                    alt={`partner-logo-${i}`}
                                                    className="h-12 w-auto max-w-[120px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                                                />
                                            </div>
                                        </motion.div>
                                    ))
                                }
                            </motion.div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
                    >
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                            <div className="text-gray-600">Trusted Partners</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                            <div className="text-gray-600">Countries</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-600 mb-2">99%</div>
                            <div className="text-gray-600">Satisfaction Rate</div>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-10 w-12 h-12 bg-blue-100 rounded-full opacity-60"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 0],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-10 left-10 w-16 h-16 bg-purple-100 rounded-full opacity-60"
                />
            </section>
        </>
    );
};

export default OurPartner;
