'use client';

import React, { useState } from 'react';

const DemoDetails = () => {
  const [expandedItem, setExpandedItem] = useState(2);
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      id: 1,
      title: 'Start Booking from Any Channel',
      description: 'Guests can book from your website, mobile app, or live chat interface seamlessly.',
    },
    {
      id: 2,
      title: 'Personalized Scheduling',
      description: 'Intelligent algorithms learn customer preferences to suggest the best available slots.',
    },
    {
      id: 3,
      title: 'Add Services or Book for Groups',
      description: 'Guests can add multiple services, schedule group bookings, or redeem packages—all in a single session.',
      expanded: true,
    },
    {
      id: 4,
      title: 'Confirm, Pay, and Sync',
      description: 'Complete the booking with instant confirmation, secure payment, and automatic synchronization across all channels.',
    },
  ];

  const benefits = [
    {
      icon: '📱',
      title: '24/7 Booking, Anywhere',
      description: 'Let guests book anytime via web, app, or SmartBot—branded to match your business.',
    },
    {
      icon: '⏱️',
      title: 'Smarter Scheduling',
      description: 'An intelligent engine follows your rules, skills, and provider preferences to match the right provider every time.',
    },
    {
      icon: '✓',
      title: 'Personalized Guest Journeys',
      description: 'Boost rebookings with tailored suggestions based on visit history and loyalty.',
    },
    {
      icon: '💰',
      title: 'More Revenue, Less Effort',
      description: 'Drive upsells with packages, memberships, and prepaid options—built right into the booking flow.',
    },
  ];

  const simplicitySectionFeatures = [
    {
      id: 1,
      title: 'Trakky Webstore',
      description: 'Give guests a branded storefront to browse and book services directly.',
    },
    {
      id: 2,
      title: 'Consumer Mobile App',
      description: 'Put your brand in your guest\'s pocket. Enables rebooking, loyalty tracking, mobile check-in, and in-app payments. Businesses using the app see up to 50% more bookings and 33% higher average value.',
      expanded: true,
    },
    {
      id: 3,
      title: 'SmartBot',
      description: 'AI-powered chatbot that handles booking inquiries and manages scheduling even outside business hours.',
    },
    {
      id: 4,
      title: 'Omnichannel Sync',
      description: 'Seamlessly synchronize bookings across all channels to ensure consistency and prevent double-bookings.',
    },
  ];

  const carouselSlides = [
    {
      id: 1,
      title: 'SmartBot Assistant',
      description: 'Intelligent booking—even outside business hours',
      bgColor: 'from-slate-200 to-slate-300',
    },
    {
      id: 2,
      title: 'Reserve with Google + Social',
      description: 'Capture new bookings from Search, Maps, Facebook, and Instagram',
      bgColor: 'from-emerald-200 to-emerald-300',
    },
    {
      id: 3,
      title: 'Group & Add-On Friendly',
      description: 'Let guests book for multiple people or add services on the fly',
      bgColor: 'from-pink-200 to-pink-300',
    },
    {
      id: 4,
      title: 'Prepayments, Deposits & Gift Cards',
      description: 'Collect payments, apply gift cards, and reduce no-shows',
      bgColor: 'from-blue-200 to-blue-300',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  return (
    <div className="w-full bg-white pt-16">
      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 lg:px-12">
        <div className="max-w-[1280px] px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 border-2 border-gray-800 rounded-full text-sm font-semibold text-gray-800">
              ONLINE BOOKING
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Elevate Your Online Booking Experience
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Make it easy for guests to book anytime—from your website, app, or chat. Our online booking solutions help you deliver a seamless, branded, always-on experience that delights guests and drives revenue.
            </p>
            <button className="px-6 py-3 bg-[#7557D4] hover:bg-[#7557D4] text-white font-semibold rounded-lg transition-colors duration-200">
              Schedule Your Free Demo →
            </button>
          </div>
          <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl overflow-hidden flex items-center justify-center">
            <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: 'url(https://media.licdn.com/dms/image/v2/D5612AQH_0NtllX41Vw/article-cover_image-shrink_720_1280/B56ZnHk9mlHAAI-/0/1759989981038?e=2147483647&v=beta&t=SBL8hEkzk0f5DGZOtBme5R7O2c7QarDjGhJNAz8wRCs)'}}></div>
          </div>
        </div>
      </section>

  {/* Features Section */}
  <section className="px-6 py-16 md:py-24 lg:px-12 bg-gradient-to-t from-black/10 to-[#7557D4] rounded-b-[50px]">
  <div className="max-w-[1280px] px-6 mx-auto">
    <div className="text-center mb-16 space-y-4">
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        Always On. Always On Brand.
      </h2>
      <p className="text-lg text-purple-100 max-w-3xl mx-auto leading-relaxed">
        Trakky Online Booking works across web, mobile, and chat to deliver a frictionless experience, 24/7.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-300"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="text-3xl">{benefit.icon}</div>
            <h3 className="text-xl font-bold text-gray-900">{benefit.title}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>


      
      {/* How It Works Section */}
      <section className="px-6 py-16  bg-gray-50 mx-auto">
        <div className="max-w-[1280px] px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            How Online Booking Works
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Accordion */}
            <div className="lg:col-span-1 space-y-0">
              {features.map((feature) => (
                <div key={feature.id} className="border-b border-gray-300 last:border-b-0">
                  <button
                    onClick={() => setExpandedItem(expandedItem === feature.id ? null : feature.id)}
                    className="w-full py-5 px-0 flex justify-between items-center text-left hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-gray-400 min-w-max">
                        0{feature.id}.
                      </span>
                      <span className="text-lg font-semibold text-gray-900">{feature.title}</span>
                    </div>
                    <span className="text-2xl text-[#7557D4] font-light">
                      {expandedItem === feature.id ? '−' : '+'}
                    </span>
                  </button>
                  
                  {expandedItem === feature.id && (
                    <div className="pb-5 px-0 text-gray-600 text-base leading-relaxed">
                      {feature.description}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column - Mobile Mockups */}
            <div className="lg:col-span-2 flex items-center justify-center">
              <div className="relative w-full h-96 flex items-end justify-center gap-4">
                {/* Phone 1 */}
                <div className="w-32 h-80 bg-gradient-to-b from-[#7557D4] to-[#7557D4] rounded-3xl shadow-lg p-2 flex flex-col items-center justify-center">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-xs text-gray-400 font-semibold">
                    <span className="text-center">App Interface</span>
                  </div>
                </div>

                {/* Phone 2 */}
                <div className="w-32 h-80 bg-gradient-to-b from-[#7557D4] to-[#7557D4] rounded-3xl shadow-xl p-2 flex flex-col items-center justify-center transform scale-105">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-xs text-gray-400 font-semibold">
                    <span className="text-center">Featured View</span>
                  </div>
                </div>

                {/* Phone 3 */}
                <div className="w-32 h-80 bg-gradient-to-b from-[#7557D4] to-[#7557D4] rounded-3xl shadow-lg p-2 flex flex-col items-center justify-center">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-xs text-gray-400 font-semibold">
                    <span className="text-center">Chat View</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    

      <section className="px-6 py-16 md:py-24 lg:px-12 bg-white">
        <div className="max-w-[1280px] px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Built for Simplicity.<br />Optimized for Growth.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Mobile Mockup */}
            <div className="flex items-center justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-sm flex items-center justify-center">
                {/* Mobile Phone Frame */}
                <div className="w-48 bg-gradient-to-b from-purple-900 to-purple-800 rounded-3xl shadow-2xl p-2.5 flex flex-col items-center justify-center">
                  <div className="w-full h-96 bg-gradient-to-b from-amber-50 to-pink-100 rounded-2xl flex flex-col items-center justify-center p-4 space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Welcome to Beuforce</p>
                      <p className="text-xs text-gray-600">We have a curated experience for you, select an option to start</p>
                    </div>
                    <div className="w-full space-y-3">
                      <button className="w-full py-2 px-4 bg-gray-800 text-white text-xs font-semibold rounded-lg hover:bg-gray-900 transition-colors">
                        Sign in / Check in
                      </button>
                      <button className="w-full py-2 px-4 bg-gray-700 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                        Continue as Guest
                      </button>
                    </div>
                    <button className="text-xs font-semibold text-gray-700 hover:text-gray-900">
                      Edit
                    </button>
                  </div>
                </div>

                {/* Queue Card */}
                <div className="absolute top-12 -right-12 w-40 bg-white rounded-2xl shadow-lg p-4 border border-pink-200">
                  <p className="text-sm font-semibold text-gray-900 mb-3">7 people in queue</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-700">
                      <span>Hazel</span>
                      <span>1</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-700">
                      <span>Jenny</span>
                      <span>2</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-700">
                      <span>Mia</span>
                      <span>3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Accordion */}
            <div className="lg:col-span-1 space-y-0 order-1 lg:order-2">
              {simplicitySectionFeatures.map((feature) => (
                <div key={feature.id} className="border-b border-gray-300 last:border-b-0">
                  <button
                    onClick={() => setExpandedItem(expandedItem === feature.id ? null : feature.id)}
                    className="w-full py-5 px-0 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-gray-400 min-w-max">
                        0{feature.id}.
                      </span>
                      <span className="text-lg font-semibold text-gray-900">{feature.title}</span>
                    </div>
                    <span className="text-2xl text-[#7557D4] font-light">
                      {expandedItem === feature.id ? '−' : '+'}
                    </span>
                  </button>
                  
                  {expandedItem === feature.id && (
                    <div className="pb-5 px-0 text-gray-600 text-base leading-relaxed">
                      {feature.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24 lg:px-12 bg-white">
        <div className="max-w-[1280px] px-6 mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Built to Book. Designed to Delight.
            </h2>
            
            {/* Carousel Navigation */}
            <div className="flex gap-4">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full border-2 border-gray-300 hover:border-[#7557D4] text-gray-600 hover:text-[#7557D4] transition-colors"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full border-2 border-gray-300 hover:border-[#7557D4] text-gray-600 hover:text-[#7557D4] transition-colors"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out"
              style={{transform: `translateX(-${currentSlide * 100}%)`}}>
           {carouselSlides.map((slide) => (
  <div
    key={slide.id}
    className="w-full flex-shrink-0 px-4"
  >
    <div
      className={`
        bg-gradient-to-tl 
        ${slide.bgColor}
        rounded-3xl 
        p-12 
        min-h-64 
        flex flex-col 
        justify-center
      `}
    >
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {slide.title}
      </h3>
      <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
        {slide.description}
      </p>
    </div>
  </div>
))}

            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-[#7557D4] w-8' : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default DemoDetails;
