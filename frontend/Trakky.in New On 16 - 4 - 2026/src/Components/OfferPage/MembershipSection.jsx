import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const MembershipSection = () => {
    const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });
    const [activeIndex, setActiveIndex] = useState(0);

    const keyframes = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `;

    // Premium grooming service images (placeholder from Unsplash)
    const images = [
        {
            src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            alt: "Professional Barber Service",
            caption: "Expert Haircuts"
        },
        {
            src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            alt: "Beard Grooming",
            caption: "Beard Trimming & Styling"
        },
        {
            src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            alt: "Luxury Hair Treatment",
            caption: "Premium Hair Treatments"
        },
        {
            src: "https://images.unsplash.com/photo-1560869713-5f5e36a1c47a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            alt: "Facial Care",
            caption: "Revitalizing Facials"
        }
    ];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-800 rounded-2xl mx-4 my-8 p-6 md:p-8 lg:p-10 shadow-xl"
        >
            {/* Animated background bubbles */}
            <div className="absolute inset-0 overflow-hidden">
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white bg-opacity-10"
                        initial={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            x: Math.random() * 100,
                            y: Math.random() * 100,
                            opacity: 0
                        }}
                        animate={{
                            x: [null, Math.random() * 100],
                            y: [null, Math.random() * 100],
                            opacity: [0, 0.1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            <style>{keyframes}</style>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Text content */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <motion.h2
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: inView ? 0 : -20, opacity: inView ? 1 : 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-white"
                    >
                        Get Trakky's <span className="text-yellow-300" >Exclusive Membership</span>
                    </motion.h2>

                    <motion.p
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: inView ? 0 : -20, opacity: inView ? 1 : 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-lg md:text-xl text-purple-100"
                    >
                        Enjoy premium grooming services at member-only prices
                    </motion.p>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: inView ? 1 : 0.9, opacity: inView ? 1 : 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        style={{ animation: 'pulse 2s infinite' }}
                        className="inline-block bg-yellow-400 text-purple-900 font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <span className="text-2xl">₹299</span>
                        <span className="text-sm ml-1">for 6 months</span>
                    </motion.div>
                </div>

                {/* Image Swiper */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-xl overflow-hidden border-2 border-white border-opacity-20 shadow-lg">
                    <Swiper
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        navigation
                        speed={1000}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        className="h-full w-full"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="h-full w-full relative">
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30" />
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{
                                            opacity: activeIndex === index ? 1 : 0,
                                            y: activeIndex === index ? 0 : 20
                                        }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent text-white text-center"
                                    >
                                        <p className="text-sm font-medium">{image.caption}</p>
                                        <p className="text-xs opacity-80 mt-1">Membership Exclusive</p>
                                    </motion.div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Benefits section */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                    { icon: '✂️', text: 'Precision Haircuts', desc: 'Expert stylists' },
                    { icon: '🧔', text: 'Beard Grooming', desc: 'Hot towel service' },
                    { icon: '💆', text: 'Facials', desc: 'Skin rejuvenation' },
                    { icon: '👑', text: 'VIP Treatment', desc: 'Priority booking' }
                ].map((benefit, index) => (
                    <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: inView ? 0 : 20, opacity: inView ? 1 : 0 }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                        className="bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl text-center border border-white border-opacity-20 hover:bg-opacity-20 transition-all"
                    >
                        <div className="text-2xl mb-2">{benefit.icon}</div>
                        <div className="text-sm font-bold text-white">{benefit.text}</div>
                        <div className="text-xs text-purple-100 mt-1">{benefit.desc}</div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default MembershipSection;