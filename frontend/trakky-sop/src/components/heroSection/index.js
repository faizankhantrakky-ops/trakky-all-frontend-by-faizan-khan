    "use client"
    import React, { useState } from 'react'
    import Image from 'next/image'
    import Icon from '../icon'
    import Link from 'next/link'
    import { HeroFour, HeroOne, HeroThree, HeroTwo } from '@/assets'

    const HeroSection = () => {
        const [expanded, setExpanded] = useState(false);
        const fullText = `Trakky is India’s #1 Salon Management Software, trusted by modern salon experts.With Trakky, you can save time, reduce no-shows, and grow your salon business faster.
    Whether your salon is in Ahmedabad, Mumbai, Delhi, Bangalore, or anywhere in India, Trakky simplifies salon operations and boosts your business efficiency.`;
        const truncateLimit = 150;

        const displayedText = expanded ? fullText : fullText.slice(0, truncateLimit);

        return (
            <>
                <div className="w-full h-fit pt-48 sm:h-screen flex justify-center px-4 sm:pb-10 xl:px-0 xl:mt-24 xl:pt-28 items-start py-20 xl:items-center">
                    <div className="relative max-w-[1200px] w-full  flex flex-col-reverse xl:flex-row items-center gap-10 justify-between">

                        <div className="absolute inset-0 flex justify-center items-center">
                            <div className="w-[600px] h-[400px] bg-gradient-to-r from-[#b5accf8f] via-[#ab97e3] to-[#A088F7] rounded-3xl blur-3xl opacity-40"></div>
                        </div>

                        {/* Left Content */}
                        <div className="relative z-1 flex-1 text-left w-full xl:w-[45%]">
                            <p className="text-sm uppercase tracking-wider text-[#5E38D1] font-semibold mb-3">
                                Trakky Smart Salon Management Software in India to Manage Appointments, Staff, Billing & Clients with Ease
                            </p>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 !leading-[3rem] md:!leading-[5rem] xl:!leading-[4.5rem]">
                                Best <span className="text-[#5E38D1]">Salon Management </span> <br />  Software in India
                            </h1>
                            <p className="text-gray-600 max-w-md mb-2">
                                {displayedText}
                                {!expanded && fullText.length > truncateLimit ? "..." : ""}
                                {fullText.length > truncateLimit && (
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="text-[#5E38D1] font-semibold underline hover:text-[#4b2bb0] transition mb-8"
                                    >
                                        {expanded ? "View Less" : "View More"}
                                    </button>
                                )}
                            </p>

                            <Link href={"/schedule-demo"}>
                                <button className="px-6 py-3 flex gap-x-4 justify-center items-center bg-[#5E38D1] text-white rounded-lg shadow-lg hover:bg-[#4b2bb0] transition">
                                    Schedule a Demo
                                    <Icon
                                        icon={"famicons:calendar-outline"}
                                        height={25}
                                        width={25} />
                                </button>
                            </Link>
                        </div>

                        {/* Right Image - Collage */}
                        <div className="relative w-full xl:w-[45%] z-10 hidden xl:flex justify-center gap-6">
                            {/* Left Column */}
                            <div className="flex flex-col gap-6">
                                <div className="rounded-xl h-[100px] sm:h-[200px] sm:w-[200px] w-[100px] xl:h-[200px] xl:w-[250px] overflow-hidden shadow-lg">
                                    <Image
                                        src={HeroOne}
                                        alt="Salon Style"
                                        width={300}
                                        height={300}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="rounded-xl sm:h-[150px] h-[150px] sm:w-[200px] w-[100px] xl:h-[300px] xl:w-[250px] overflow-hidden shadow-lg">
                                    <Image
                                        src={HeroTwo}
                                        alt="Makeover"
                                        width={300}
                                        height={300}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="flex flex-col gap-6 mt-10">
                                <div className="rounded-xl sm:h-[150px] h-[150px] sm:w-[200px] w-[100px] xl:h-[300px] xl:w-[250px] overflow-hidden shadow-lg">
                                    <Image
                                        src={HeroThree}
                                        alt="Hair"
                                        width={300}
                                        height={300}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="rounded-xl h-[100px] sm:h-[200px] sm:w-[200px] w-[100px] xl:h-[200px] xl:w-[250px] overflow-hidden shadow-lg">
                                    <Image
                                        src={HeroFour}
                                        alt="Beauty Care"
                                        width={300}
                                        height={300}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        )
    }

    export default HeroSection
