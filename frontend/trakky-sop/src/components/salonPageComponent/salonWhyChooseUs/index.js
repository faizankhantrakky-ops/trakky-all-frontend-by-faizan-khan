"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../../icon";
import Image from "next/image";
import { BenefitsSalonPage } from "@/mock/data";

// ------------------------------------------------------------

const WhyChooseUs = () => {

    const [active, setActive] = useState(0);
    const [benefits] = useState(BenefitsSalonPage)

    return (
        <>
            <section className="relative w-full pt-10 pb-20 bg-white">
                <div className="max-w-[1200px] mx-auto px-8 xl:px-0 lg:px-12 grid md:grid-cols-2 gap-12 items-start">
                    {/* Left side heading */}
                    <div>
                        <h2 className="text-4xl md:text-5xl !leading-[3rem] xl:!leading-[4rem] font-semibold text-gray-800 mb-6">
                            Why 200+ Salons Trust{" "}
                            <span className="text-[#5E38D1]">Trakky </span>?
                        </h2>
                        <p className="text-gray-500 text-lg">
                            At Trakky, we focus on solving real challenges faced by salon owners, helping you run a smoother, faster, and more profitable salon business. so you can focus on what truly matters: your customers.
                        </p>
                    </div>

                    {/* Right side accordion */}
                    <div className="flex flex-col gap-6">
                        {benefits.map((item, idx) => (
                            <div
                                key={idx}
                                className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                            >
                                {/* Header */}
                                <button
                                    onClick={() => setActive(active === idx ? -1 : idx)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 flex items-center justify-center rounded-full bg-[#F3F0FF] text-[#5E38D1]">
                                            <Icon icon={item.icon} width={24} height={24} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <Icon
                                        icon={
                                            active === idx ? "mdi:chevron-up" : "mdi:chevron-down"
                                        }
                                        className="text-gray-500"
                                        width={24}
                                        height={24}
                                    />
                                </button>

                                {/* Content */}
                                <AnimatePresence>
                                    {active === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="px-6 pb-6"
                                        >
                                            <p className="text-gray-600 mb-4">{item.desc}</p>
                                            <Image
                                                src={item.img}
                                                alt={item.title}
                                                className="rounded-xl shadow-md"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default WhyChooseUs;
