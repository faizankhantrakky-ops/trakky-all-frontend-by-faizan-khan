"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import HowItWorksMobile from "../howItWorksMobile";
import { HowItWorksStepsData } from "@/mock/data";
import Icon from "../icon";

// -----------------------------------------------

const StepCard = ({ step, idx }) => {

    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

    return (
        <>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="relative flex-1 max-w-sm bg-white bg-opacity-60 backdrop-blur-lg rounded-3xl shadow-lg p-10 flex flex-col items-center text-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl z-10"
            >
                <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-indigo-100 text-[#7355D1] text-5xl shadow-md">
                    <Icon icon={step.icon} />
                </div>
                <h3 className="text-2xl font-bold text-indigo-900 mb-3">{step.title}</h3>
                <p className="text-indigo-700 text-sm leading-relaxed">{step.desc}</p>
                <div className="mt-8 w-12 h-12 bg-indigo-600 text-white font-extrabold rounded-full flex items-center justify-center text-lg shadow-lg">
                    {idx + 1}
                </div>
            </motion.div>
        </>
    );
};

const HowItWorksSection = () => {

    const [steps] = useState(HowItWorksStepsData);

    return (
        <>
            {/* Desktop View */}
            <div className="hidden xl:block">
                <section className="w-full py-24 bg-gradient-to-br from-white via-indigo-50 to-indigo-100 relative">
                    {/* Floating Icons */}
                    <motion.div
                        className="absolute top-[80px] left-[200px] text-indigo-300 pointer-events-none"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, opacity: 0.5 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    >
                        <Icon icon={"mdi:spa"} className={"animate-bounce"} width="30" height="30" />
                    </motion.div>

                    <motion.div
                        className="absolute top-[700px] left-[300px] text-indigo-300 pointer-events-none"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, opacity: 0.5 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    >
                        <Icon icon={"solar:scissors-broken"} className={"animate-bounce"} width="30" height="30" />
                    </motion.div>

                    <motion.div
                        className="absolute top-[150px] right-[200px] text-indigo-300 pointer-events-none"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, opacity: 0.5 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    >
                        <Icon icon={"hugeicons:yoga-01"} className={"animate-bounce"} width="30" height="30" />
                    </motion.div>

                    <motion.div
                        className="absolute top-[700px] right-[300px] text-indigo-200 pointer-events-none"
                        initial={{ opacity: 0.5, y: 30 }}
                        animate={{ opacity: 0.4, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        <Icon className={"animate-bounce"} icon={"mdi:hair-dryer"} width="30" height="30" />
                    </motion.div>

                    {/* Heading */}
                    <div className="max-w-4xl mx-auto text-center px-6 sm:px-8">
                        <h2 className="text-4xl font-extrabold text-indigo-900 mb-4 drop-shadow-md">
                            How Trakky Salon Software Works
                        </h2>
                        <p className="text-indigo-700 text-lg max-w-2xl mx-auto">
                            Get started with Trakky in just a few simple steps and transform the way you run your salon. Our all-in-one salon management software makes it easy to handle bookings, staff, payments, and customer relationships so you can focus on growing your business.

                        </p>
                    </div>

                    {/* Steps */}
                    <div className="mt-20 flex flex-col md:flex-row flex-wrap justify-center gap-12 px-6 sm:px-8 relative">
                        <div className="hidden md:block absolute top-24 left-0 right-0 mx-auto h-1 bg-indigo-300 rounded-full w-4/5 z-0"></div>

                        {steps.map((step, idx) => (
                            <StepCard key={idx} step={step} idx={idx} />
                        ))}
                    </div>
                </section>
            </div>

            {/* Mobile View */}
            <div className="xl:hidden">
                <HowItWorksMobile steps={steps} />
            </div>
        </>
    );
};

export default HowItWorksSection;
