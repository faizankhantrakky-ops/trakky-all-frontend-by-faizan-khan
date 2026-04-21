"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ------------------------------------------

const CTAComponent = () => {
    return (
        <>
            <section className="w-full bg-[#7C60D6] py-24">
                <div className="max-w-[1200px] mx-auto flex flex-col xl:flex-row justify-between items-center gap-12 px-8 xl:px-0">

                    {/* Left Text Section */}
                    <motion.div
                        viewport={{ once: true }}
                        initial={{ opacity: 0, x: -80 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9 }}
                        className="text-center xl:text-left text-white max-w-2xl"
                    >
                        <h2 className="text-4xl xl:text-6xl font-extrabold !leading-[3rem] lg:!leading-[5rem] drop-shadow-lg">
                            Upgrade Your
                            <span className="text-yellow-300 ml-4">
                                Salon
                            </span>
                            <br />
                            with Trakky POS
                        </h2>
                        <p className="mt-6 text-xl opacity-90 leading-relaxed">
                            Deliver a seamless experience to your customers and manage your entire salon from one platform. With Trakky POS. India’s leading salon management software, you can easily book appointments, track payments, manage billing, and monitor performance. Trakky helps you save time, grow faster, and keep your clients happy all with a single smart solution.
                        </p>
                    </motion.div>

                    {/* Right Action Section */}
                    <motion.div
                        viewport={{ once: true }}
                        initial={{ opacity: 0, y: 80 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-5"
                    >
                        <Link href={"/schedule-demo"}>
                            <button className="px-10 py-5 rounded-full text-lg font-semibold shadow-lg bg-yellow-300 text-[#5E38D1] hover:bg-white transition-all duration-300">
                                Book a Free Demo
                            </button>
                        </Link>
                        <Link href={"/pricing"}>
                            <button className="px-10 py-5 rounded-full text-lg font-semibold shadow-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#5E38D1] transition-all duration-300">
                                View Pricing
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default CTAComponent;
