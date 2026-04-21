"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { PricingPlansData } from "@/mock/data";
import Link from "next/link";

// --------------------------------------

const PricingComponent = () => {

    const [pricingPlans] = useState(PricingPlansData)

    return (
        <>
            <section className="min-h-screen bg-white pt-52 py-20 px-6 flex flex-col items-center">
                <div className="max-w-[1200px] w-full text-center">
                    <h2 className="text-5xl font-extrabold text-[#5E38D1] mb-4">
                        Choose Your Plan  Flexible Salon POS Solutions
                    </h2>
                    <p className="text-gray-600 mb-14 max-w-[700px] mx-auto text-lg">
                        Flexible pricing designed to fit POS systems of all sizes, whether you’re starting a small salon or scaling your business globally.
                    </p>

                    <div className="flex justify-center items-center gap-10">
                        {pricingPlans.map((plan) => (
                            <motion.div
                                key={plan.id}
                                className="bg-gray-50 border border-gray-200 rounded-3xl p-8 cursor-pointer transition-colors"
                            >
                                <h3 className="text-3xl font-semibold text-[#5E38D1] mb-3">
                                    {plan.name}
                                </h3>
                                <p className="text-gray-700 mb-5 italic">{plan.desc}</p>
                                <p className="text-4xl font-extrabold text-gray-900 mb-8">
                                    {plan.price}
                                </p>

                                <ul className="text-gray-700 space-y-3 mb-8">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-3 text-lg">
                                            <span className="text-[#7E68E7] text-xl">✔</span> {f}
                                        </li>
                                    ))}
                                </ul>

                                {
                                    plan?.extra && <p className="pb-8 text-justify">
                                        Best for: {plan?.extra}
                                    </p>
                                }

                                <Link href={'/schedule-demo'}>
                                    <button
                                        className="w-full mt-auto px-8 py-3 rounded-full bg-[#7355D0] text-white font-semibold hover:bg-[#6B48E7] transition"
                                    >
                                        Start Now
                                    </button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default PricingComponent;
