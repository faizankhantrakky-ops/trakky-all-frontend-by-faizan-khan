"use client";
import React from "react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
    return (
        <section className=" md:pt-0 pt-10 md:pb-5 pb-5 min-h-screen flex items-center justify-center  px-6">
            <div className="max-w-[1200px] w-full flex lg:pt-10 flex-col items-center text-center mt-24">
         

                {/* Coming Soon Badge */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="mb-6"
                >
                    <span className="px-6 py-2 bg-[#6B48E7] text-white text-sm font-semibold rounded-full shadow-lg">
                        COMING SOON
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.7 }}
                    className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
                >
                    Feature Coming Soon!
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.7 }}
                    className="text-gray-600 text-xl md:text-2xl max-w-[700px] mb-8 leading-relaxed"
                >
                    We're working hard to bring you this amazing feature. 
                    <br className="hidden md:block" />
                    Stay tuned for updates and get ready for something special!
                </motion.p>

             

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.7 }}
                    className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg max-w-2xl mb-8"
                >
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                        What to Expect
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-left">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-gray-700">Innovative Solutions</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-gray-700">Enhanced User Experience</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-gray-700">Time-Saving Features</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-gray-700">Seamless Integration</span>
                        </div>
                    </div>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    transition={{ delay: 1.6, duration: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <motion.a
                        href="/"
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-[#7355D1] text-white rounded-full font-semibold shadow-lg  transition-all duration-300 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Back to Homepage
                    </motion.a>
                    
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 border-2 border-[#7355D1] text-[#7355D1] rounded-full font-semibold hover:bg-[#7355D1] hover:text-white transition-all duration-300 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Notify Me
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default NotFoundPage;