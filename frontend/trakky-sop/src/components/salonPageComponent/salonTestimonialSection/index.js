"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

// ---------------------------------------------

const testimonials = [
    {
        id: 1,
        name: "Priya Sharma",
        position: " Salon Owner, Ahmedabad",
        text: "Trakky completely transformed the way I manage appointments and staff schedules. Bookings are now smoother, and my revenue has increased by 35%.",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUuldJv9nbdmRF1KyAIWG3a-m4AY4_gf4-Tw&s",
        color: "from-purple-500 to-purple-600",
        position_style: "left"
    },
    {
        id: 2,
        name: "Rohit Mehta",
        position: "Salon Owner, Ahmedabad",
        text: "Managing client records and payments is now effortless. Trakky POS is a true game-changer for salon growth.",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd8UY1fvFiISC5H9i66D0LwphV06eM6_fb8A&s",
        color: "from-blue-500 to-blue-600",
        position_style: "right"
    },
    {
        id: 3,
        name: "Sneha Patel",
        position: "Beauty Expert, Ahmedabad",
        text: "The system is intuitive and helps me focus more on clients than admin tasks. Highly recommend!",
        avatar: "https://media.licdn.com/dms/image/v2/C4E03AQHrstbIS8zLSw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1658247259185?e=2147483647&v=beta&t=UehVbxfyu7qahoGLuPgMgqnO-qTXJ4XRUNAbgyaPMuo",
        color: "from-pink-500 to-pink-600",
        position_style: "left"
    },
    {
        id: 4,
        name: "Vikram Singh",
        position: "Nail Studio Owner, Ahmedabad",
        text: "Best decision for my business! Quick bookings, instant invoices, and the dashboard gives me complete control. Customer satisfaction is at an all-time high! 🎯",
        avatar: "https://pbs.twimg.com/profile_images/1555481008727662593/6bk1Zsra_400x400.jpg",
        color: "from-green-500 to-green-600",
        position_style: "right"
    },
    {
        id: 5,
        name: "Nikita Jinjukre",
        position: "Hair Salon, Ahmedabad",
        text: "Trakky made managing my salon stress-free. The analytics help me make better decisions, and clients appreciate the professional booking experience! 💯",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdMgGmtuNJXJF1TKlRch-pY2z5gdLuJUMLMw&s",
        color: "from-indigo-500 to-indigo-600",
        position_style: "left"
    },
]

// ---------------------------------------------

const SalonPageTestimonialSection = () => {

    // const [testimonials] = useState(TestimonialsSalonPageData)

    return (
        <>
            <section className="relative w-full py-20 bg-white overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-10 right-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30" />

                <div className="max-w-[1200px] mx-auto px-8 xl:px-0 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="inline-block mb-8 px-5 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full"
                        >
                            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                TESTIMONIALS
                            </span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-4xl !leading-[3rem] md:text-5xl font-bold text-gray-900 mb-8"
                        >
                            What Our{" "}
                            <span className="text-[#7053CC] bg-clip-text ">
                                Clients Say
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-lg text-gray-600 max-w-2xl mx-auto"
                        >
                            Real stories from salon owners who transformed their business with Trakky
                        </motion.p>
                    </div>

                    {/* Mobile: Swiper Horizontal Scroll */}
                    <div className="lg:hidden">
                        <Swiper
                            spaceBetween={24}
                            slidesPerView={"auto"}
                            grabCursor={true}
                            className="pb-6"
                        >
                            {testimonials.map((testimonial) => (
                                <SwiperSlide
                                    key={testimonial.id}
                                    style={{ width: '85vw', maxWidth: '400px' }}
                                >
                                    <ChatBubble testimonial={testimonial} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Desktop: Staggered Grid */}
                    <div className="hidden lg:grid grid-cols-2 gap-8 relative">
                        {testimonials.map((testimonial, idx) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.15 }}
                                viewport={{ once: true }}
                                className={`${idx % 2 === 1 ? 'lg:mt-12' : ''}`}
                            >
                                <ChatBubble testimonial={testimonial} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Custom Scrollbar Styles */}
                <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            </section>
        </>
    );
};

// ---------------------------------------------------------------

const ChatBubble = ({ testimonial }) => {

    const isLeft = testimonial.position_style === "left";

    return (
        <>
            <div className={`flex gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'} px-4 lg:px-0 group`}>
                {/* Avatar */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                >
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${testimonial.color} p-0.5 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                        <Image
                            width={300}
                            height={300}
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full rounded-2xl object-cover"
                        />
                        {/* Online Status Dot */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md" />
                    </div>
                </motion.div>

                {/* Chat Bubble */}
                <div className={`flex-1 ${isLeft ? '' : 'flex justify-end'}`}>
                    <div className={`relative max-w-md`}>
                        {/* Triangle Pointer */}
                        <div
                            className={`absolute top-4 ${isLeft ? '-left-2' : '-right-2'
                                } w-4 h-4 bg-gradient-to-br ${testimonial.color} transform rotate-45`}
                        />

                        {/* Bubble Content */}
                        <motion.div
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className={`relative bg-gradient-to-br ${testimonial.color} p-[2px] rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                        >
                            <div className="bg-white rounded-3xl p-6">
                                {/* Text */}
                                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                    {testimonial.text}
                                </p>

                                {/* User Info */}
                                <div className={`flex items-center gap-3 ${isLeft ? '' : 'justify-end'}`}>
                                    <div className={isLeft ? 'text-left' : 'text-right'}>
                                        <h4 className="font-bold text-gray-900 text-sm">
                                            {testimonial.name}
                                        </h4>
                                        <p className={`text-xs bg-gradient-to-r ${testimonial.color} bg-clip-text text-transparent font-medium`}>
                                            {testimonial.position}
                                        </p>
                                    </div>
                                </div>

                                {/* Quote Icon */}
                                <div className={`absolute ${isLeft ? '-top-2 -left-2' : '-top-2 -right-2'} w-8 h-8 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center shadow-lg`}>
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>

                            </div>
                        </motion.div>

                        {/* Timestamp (chat-like detail) */}
                        <div className={`mt-2 px-3 ${isLeft ? 'text-left' : 'text-right'}`}>
                            <span className="text-xs text-gray-400 font-medium">
                                ✓✓ Verified Customer
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SalonPageTestimonialSection;
