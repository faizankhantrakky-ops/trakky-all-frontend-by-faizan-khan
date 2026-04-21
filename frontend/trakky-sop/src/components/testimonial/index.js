"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { TestimonialData } from "@/mock/data";
import Image from "next/image";

// --------------------------------------

const Testimonial = () => {

    const [testimonials] = useState(TestimonialData)

    return (
        <section className="w-full py-24 bg-white overflow-x-hidden">
            <div className="max-w-[1200px] w-full mx-auto px-6 md:px-8 xl:px-0">
                {/* Heading */}
                <motion.h2
                    viewport={{ once: true }}
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4"
                >
                    Voices of Trust from India’s Top Salon Professionals
                </motion.h2>
                <p className="text-gray-500 text-lg text-center mb-16">
                    Hear honest reviews from salon owners and beauty experts across India who rely on Trakky POS the trusted salon management software for smooth business operations, faster growth, and happier clients. Discover why India’s leading salons choose Trakky to manage appointments, billing, and staff effortlessly.
                </p>

                {/* Chat bubble style testimonials */}
                <div className="flex flex-col gap-12">
                    {testimonials.map((t, i) => (
                        <motion.div
                            viewport={{ once: true }}
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: i * 0.2 }}
                            className={`flex items-start gap-4 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse text-right"
                                }`}
                        >
                            {/* Avatar */}
                            <Image
                                src={t.img}
                                alt={t.name}
                                width={300}
                                height={300}
                                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-200 shadow-md"
                            />

                            {/* Bubble */}
                            <div
                                className={`relative w-[85%] max-w-[320px] md:max-w-md p-5 md:p-6 rounded-2xl shadow-md ${i % 2 === 0
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-purple-600 text-white"
                                    }`}
                            >
                                <p className="italic leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                                    “{t.quote}”
                                </p>
                                <h4 className="font-bold text-base md:text-lg">{t.name}</h4>
                                <span className="text-xs md:text-sm opacity-80">{t.role}</span>

                                {/* Bubble arrow */}
                                <span
                                    className={`absolute top-6 ${i % 2 === 0
                                        ? "-left-3 border-r-gray-100"
                                        : "-right-3 border-l-purple-600"
                                        } border-8 border-transparent`}
                                ></span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonial;
