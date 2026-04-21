import React from 'react';
import { Helmet } from 'react-helmet-async';
import SecondParnterwith from './SecondParnterwith/SecondParnterwith';
import ThirdWithUs from './ThirdWithUs/ThirdWithUs';
import Partertestemnial from './Partertestemnial/Partertestemnial';
import PartnerwithusFooter from './PartnerwithusFooter/PartnerwithusFooter';
import FAQSPartnerwith from './FAQSPartnerwith/FAQSPartnerwith';
import SalonPlatformBenefits from './SalonPlatformBenefits/SalonPlatformBenefits';

const Partnerwithus = () => {
  return (
    <>
      {/* SEO Meta Tags using React Helmet */}
    <Helmet>
  <title>
    Secure Your Salon Business | Free Salon Registration & Online Bookings
  </title>

  <meta
    name="description"
    content="Register your salon for free and get more clients, instant online bookings, and higher visibility. Grow your salon business with smart tools and zero commission."
  />

  <meta
    name="robots"
    content="index, follow"
  />
  <meta name="googlebot" content="index, follow" />

  <meta
    property="og:title"
    content="Secure Your Salon Business | Free Salon Registration & Online Bookings"
  />
  <meta
    property="og:description"
    content="Register your salon for free and get more clients, instant online bookings, and higher visibility. Grow your salon business with smart tools and zero commission."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="http://localhost:3000/lets-start-with-us" />
  <meta
    property="og:image"
    content="http://localhost:3000/og-image-salon.jpg"
  />

  {/* ✅ Canonical */}
  <link
    rel="canonical"
    href="http://localhost:3000/lets-start-with-us"
  />
</Helmet>


      {/* Page Content */}
      <div className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl text-gray-900 leading-tight">
                  Secure Your Salon
                  <span className="block font-bold text-[#56008F] mt-2">
                    Business Now
                  </span>
                </h1>

                <div className="h-1 w-24 bg-gradient-to-r from-[#56008F] to-[#56008F] rounded-full"></div>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Running a salon is more than delivering great services. It’s about building trust, improving visibility, and staying ahead of your competition. When you register your salon on our platform, you unlock powerful tools designed to attract new customers, increase bookings, and streamline day-to-day operations effortlessly.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                {[
                  "Advanced appointment scheduling system",
                  "Real-time inventory management",
                  "Client relationship management tools",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[#56008F] mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-4 bg-[#56008F] text-white font-medium rounded-lg hover:bg-purple-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                  Become a Partner
                </button>
                <button className="px-8 py-4 bg-white text-[#56008F] font-medium rounded-lg border-2 border-[#56008F] hover:bg-purple-50 transition-all duration-300">
                  Schedule a Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-gray-500 text-sm mb-4">
                  Trusted by leading salons nationwide
                </p>
                <div className="flex items-center gap-8">
                  <div className="text-2xl font-bold text-gray-800">100+</div>
                </div>
                <div className="flex items-center gap-8 text-xs text-gray-500">
                  <div>Active Partners</div>
                </div>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="relative">
              <img
                src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                alt="Professional salon interior with stylist working on client"
                className=" w-full object-cover"
              />
            </div>

          </div>
        </div>
      </div>

      {/* <SecondParnterwith /> */}
      <ThirdWithUs />
      <SalonPlatformBenefits/>
      <Partertestemnial />
      <FAQSPartnerwith/>
      <PartnerwithusFooter />
    </>
  );
};

export default Partnerwithus;
