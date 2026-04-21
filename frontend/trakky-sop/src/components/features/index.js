"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FeaturesData } from "@/mock/data";
import Link from "next/link";
import { motion } from "framer-motion";

// -----------------------------------------------------

const FeaturesPOS = () => {

    const [features] = useState(FeaturesData)
    const [selectedFeature, setSelectedFeature] = useState(features[0]);

    const [randomPosition, setRandomPosition] = useState("");

    useEffect(() => {
        const positions = [
            "top-[0px] left-[-20px]",
            "top-[0px] right-[-20px]",
            "bottom-[-50px] left-[-20px]",
            "bottom-[-50px] right-[-20px]",
        ];
        setRandomPosition(positions[Math.floor(Math.random() * positions.length)]);
    }, [selectedFeature.id]);

    return (
        <>
            <section className="relative w-full min-h-screen bg-white pb-20 lg:pt-20">

                {/* Subtle Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-[#5E38D1]/5 to-[#5E38D1]/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-40 left-20 w-48 h-48 bg-[#5E38D1]/5 rounded-full blur-2xl"></div>
                </div>

                <div className="relative z-10 max-w-[1200px] mx-auto px-4 xl:px-0">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5E38D1]/5 rounded-full text-[#5E38D1] text-sm font-medium mb-6">
                            <div className="w-2 h-2 bg-[#5E38D1] rounded-full animate-pulse"></div>
                            Complete Business Solution
                        </div>
                        <h2 className="text-3xl md:text-6xl md:!leading-[4.5rem] font-black text-gray-900 mb-6 !leading-[2.5rem] lg:!leading-[5rem]">
                            Why Top Salons in
                            <span className="ml-3 text-[#5E38D1]">
                                India Choose Trakky
                            </span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                            Trakky is more than just a salon booking tool — it’s a complete salon management software trusted by top salon experts in India. Manage everything from appointments, billing, and staff schedules to customer loyalty programs and inventory management, all in one powerful platform.
                        </p>
                    </div>

                    {/* Main Content - Split Layout */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left Side - Feature List */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">
                                Core Features
                            </h3>
                            {features.map((feature) => (
                                <div key={feature.id} className="mb-4">
                                    <div
                                        onClick={() => setSelectedFeature(feature)}
                                        className={`group relative cursor-pointer transition-all duration-300 ${selectedFeature.id === feature.id
                                            ? 'bg-[#5E38D1]/5 border-[#5E38D1]/20'
                                            : 'bg-gray-50/50 hover:bg-gray-50 border-gray-200/50'
                                            } border rounded-2xl p-4`}
                                    >
                                        {/* Active Indicator */}
                                        {selectedFeature.id === feature.id && (
                                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-[#5E38D1] rounded-r-full"></div>
                                        )}

                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div
                                                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedFeature.id === feature.id
                                              
                                                    }`}
                                            >
                                                <Image
                                                    src={feature.img}
                                                    width={54}
                                                    height={54}
                                                    alt={feature.title}
                                                    className="object-contain"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4
                                                        className={`w-[80%] font-semibold transition-colors ${selectedFeature.id === feature.id
                                                            ? 'text-[#5E38D1]'
                                                            : 'text-gray-900 group-hover:text-[#5E38D1]'
                                                            }`}
                                                    >
                                                        {feature.title}
                                                    </h4>
                                                    <div
                                                        className={`w-4 h-4 lg:w-6 lg:h-6 rounded-full border-2 transition-all duration-300 ${selectedFeature.id === feature.id
                                                            ? 'border-[#5E38D1] bg-[#5E38D1]'
                                                            : 'border-gray-300 group-hover:border-[#5E38D1]'
                                                            }`}
                                                    >
                                                        {selectedFeature.id === feature.id && (
                                                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {feature.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile-only Feature Detail below selected item */}
                                    {selectedFeature.id === feature.id && (
                                        <div className="lg:hidden mt-4 bg-gradient-to-br from-[#5E38D1]/5 to-[#5E38D1]/10 rounded-3xl p-4 border border-[#5E38D1]/10">
                                            <Image
                                                alt="..."
                                                width={300}
                                                height={300}
                                                src={selectedFeature?.backgroundImg} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Side - Feature Detail (Desktop only) */}
                        <div className="hidden relative lg:block lg:sticky lg:top-8">
                            <div className="bg-gradient-to-br from-[#5E38D1]/5 to-[#5E38D1]/10 rounded-3xl p-8 border border-[#5E38D1]/10">
                                <motion.div
                                    key={selectedFeature.id}
                                    initial={{ y: -50, opacity: 0 }}
                                    exit={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className={`absolute ${randomPosition}`}
                                >
                                    <Image
                                        className="w-[350px] rounded-lg"
                                        alt="..."
                                        src={selectedFeature?.overlayImg[0]}
                                        width={200}
                                        height={200}
                                    />
                                </motion.div>

                                <Image
                                    className="w-full"
                                    alt="..."
                                    src={selectedFeature?.backgroundImg}
                                    width={300} height={300} />
                                {/* <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6">
                                <Image
                                    src={selectedFeature.img}
                                    width={40}
                                    height={40}
                                    alt={selectedFeature.title}
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="text-3xl font-bold text-[#5E38D1] mb-4">{selectedFeature.title}
                            </h3>
                            <p className="text-gray-700 text-lg leading-relaxed mb-8">{selectedFeature.desc}
                            </p>
                            <div className="space-y-3 mb-8">
                                <h4 className="font-semibold text-gray-900 mb-4">
                                    Key Benefits:
                                </h4>
                                {selectedFeature.badges?.map((badge, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-[#5E38D1] rounded-full"></div>
                                        <span className="text-gray-700 font-medium">
                                            {badge}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full bg-[#5E38D1] text-white font-semibold py-4 rounded-xl hover:bg-[#5E38D1]/90 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                                Explore {selectedFeature.title}
                            </button> */}
                            </div>

                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="w-full flex flex-col items-center mt-24 relative z-10">
                        <div className="relative w-full max-w-3xl px-6 mx-auto text-center rounded-3xl bg-[#7C60D6] shadow-2xl py-16 overflow-hidden">
                            <div className="absolute -left-20 top-1/2 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
                            <h3 className="lg:text-4xl text-2xl !leading-[2rem] lg:!leading-[3rem] font-bold text-white mb-4">
                                Ready to Transform Your Salon?
                            </h3>
                            <p className="text-white/95 text-xs lg:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                                Join thousands of salons across India already using Trakky. The leading salon management software to simplify operations, boost revenue, and grow faster. Experience the power of smart salon automation with Trakky today!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href={"/pricing"}>
                                    <button
                                        className="px-10 py-4 bg-white text-[#7C60D6] font-semibold rounded-xl shadow-md transition duration-300 hover:bg-transparent hover:border hover:border-white hover:scale-105 hover:text-white"
                                    >
                                        View Pricing
                                    </button>
                                </Link> 
                                <Link href={"/schedule-demo"}>
                                    <button
                                        className="px-10 py-4 border-2 border-white text-white font-semibold rounded-xl transition duration-300 hover:bg-white/10 hover:scale-105"
                                    >
                                        Schedule Demo
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default FeaturesPOS;

