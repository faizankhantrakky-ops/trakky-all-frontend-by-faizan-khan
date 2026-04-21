"use client";
import React from "react";
import { motion } from "framer-motion";

// ------------------------------------------

const SalonCTASection = () => {
    return (
        <>
            <section className="relative bg-white py-24 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-100 rounded-full blur-3xl opacity-30" />

                <div className="max-w-[1200px] px-8 xl:px-0 mx-auto relative z-10">
                    {/* Big Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative bg-gradient-to-br from-[#b5accf] via-[#ab97e3] to-[#A088F7] rounded-[2.5rem] p-1 shadow-2xl overflow-hidden"
                    >
                        {/* Animated Background Pattern */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                            }}
                        />

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                        />
                        <motion.div
                            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                        />

                        <div className="relative bg-white/95 backdrop-blur-sm rounded-[2.4rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">

                            {/* Text Section */}
                            <div className="md:w-1/2 space-y-6">
                                {/* Badge */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                                    </span>
                                    <span className="text-sm font-bold text-purple-700">START YOUR FREE TRIAL</span>
                                </motion.div>

                                {/* Heading */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
                                >
                                    Ready to take your salon to the{" "}
                                    <span className="relative inline-block">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                            next level?
                                        </span>
                                        <motion.svg
                                            initial={{ pathLength: 0 }}
                                            whileInView={{ pathLength: 1 }}
                                            transition={{ duration: 1, delay: 0.8 }}
                                            viewport={{ once: true }}
                                            className="absolute -bottom-2 left-0 w-full"
                                            viewBox="0 0 300 12"
                                        >
                                            <motion.path
                                                d="M5 7 Q 150 -3, 295 7"
                                                stroke="url(#gradient)"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeLinecap="round"
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#9333ea" />
                                                    <stop offset="100%" stopColor="#db2777" />
                                                </linearGradient>
                                            </defs>
                                        </motion.svg>
                                    </span>
                                </motion.h2>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    viewport={{ once: true }}
                                    className="text-gray-600 text-lg md:text-xl leading-relaxed"
                                >
                                    Start your journey with Trakky today. Manage appointments, track
                                    progress, and grow your business effortlessly.
                                </motion.p>

                                {/* Feature List */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                    viewport={{ once: true }}
                                    className="flex flex-wrap gap-3"
                                >
                                    {["✓ No credit card", "✓ 30-day trial", "✓ Cancel anytime"].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                                            <span className="text-sm font-medium text-green-700">{item}</span>
                                        </div>
                                    ))}
                                </motion.div>

                                {/* Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    viewport={{ once: true }}
                                    className="flex flex-wrap gap-4 pt-4"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Start Demo
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                                            initial={{ x: "-100%" }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-8 py-4 bg-white text-purple-700 font-bold text-lg rounded-full border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        Learn More
                                    </motion.button>
                                </motion.div>

                                {/* Trust Badge */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.7 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-3 pt-4"
                                >
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400 shadow-md" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        Join <strong className="text-purple-700">5,000+</strong> happy salon owners
                                    </span>
                                </motion.div>
                            </div>

                            {/* Illustration Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="md:w-1/2 flex justify-center relative"
                            >
                                {/* Decorative Rings */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute w-full h-full border-4 border-purple-200 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                        className="absolute w-[90%] h-[90%] border-4 border-pink-200 rounded-full border-dashed"
                                    />
                                </div>

                                {/* Main Image Container */}
                                <div className="relative z-10 w-full max-w-md">
                                    <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-2xl">
                                        {/* Dashboard Mockup */}
                                        <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col justify-center items-center gap-6">
                                            {/* Icon */}
                                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>

                                            {/* Text */}
                                            <div className="text-center">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">All-in-One Solution</h3>
                                                <p className="text-gray-600">Everything you need to manage your salon</p>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-4 w-full">
                                                {[
                                                    { label: "Users", value: "5K+" },
                                                    { label: "Rating", value: "4.9★" },
                                                    { label: "Growth", value: "+40%" },
                                                ].map((stat, idx) => (
                                                    <div key={idx} className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                                                        <div className="text-xl font-bold text-purple-600">{stat.value}</div>
                                                        <div className="text-xs text-gray-600">{stat.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Floating Badge */}
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold px-4 py-2 rounded-full shadow-xl"
                                        >
                                            🔥 Trending
                                        </motion.div>
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-xl" />
                                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-full blur-xl" />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default SalonCTASection;