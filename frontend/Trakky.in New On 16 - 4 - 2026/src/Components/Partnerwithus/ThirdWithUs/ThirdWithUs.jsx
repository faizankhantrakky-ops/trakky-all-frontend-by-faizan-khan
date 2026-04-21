import React, { useRef, useEffect } from 'react';

const ThirdWithUs = () => {
  const containerRef = useRef(null);

  // New salon benefits data
  const salonBenefits = [
    {
      title: "Become Visible to Thousands of New Customers",
      points: [
        "Whenever someone searches for anything related to salons, your business appears.",
        "Increase walk-ins and online appointments.",
        "Build instant credibility and brand trust"
      ]
    },
    {
      title: "Easily Schedule Appointments Online",
      points: [
        "Customers can book services instantly.",
        "No more phone calls or manual confirmations.",
        "Automated reminders help reduce no-shows"
      ]
    },
    {
      title: "Boost Your Salon’s Daily Revenue",
      points: [
        "More bookings mean higher earnings.",
        "Promote high-value services, packages & combos.",
        "Upsell premium services through your online profile."
      ]
    },
    {
      title: "Build a Strong and Professional Presence Online",
      points: [
        "Add salon photos, ambience, and service details.",
        "Showcase pricing, staff profiles & customer reviews.",
        "Stand out from other salons in your area."
      ]
    },
    {
      title: "All-in-One Dashboard for Smooth Management",
      points: [
        "Manage bookings in one simple panel",
        "Track customer visits & service history",
        "Use analytics to understand performance and improve growth"
      ]
    },
    {
      title: "Build Customer Trust with Verified Listing",
      points: [
        "Verified salons receive more bookings.",
        "Customers feel confident choosing your business.",
        "Helps you build long-term loyal clients."
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isInView = rect.top <= 100 && rect.bottom >= window.innerHeight * 0.5;

      if (isInView) {
        container.classList.add('active');
      } else {
        container.classList.remove('active');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Sticky */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl md:text-6xl text-gray-900 mb-8">
                  Come build
                  <span className="block text-[#56008F] mt-2">with us</span>
                </h2>
                <div className="w-24 h-1 bg-[#56008F] mb-10"></div>
              </div>

              <div className="space-y-8">
                <p className="text-xl text-gray-600 leading-relaxed">
                  We believe that our tech stack and operational backbone can empower 
                  thousands of local entrepreneurs to serve the needs of millions of Indians.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our vision of a marketplace where anyone can open their storefront on Trakky, 
                  will enable us to deliver anything from groceries, to medicines, to beauty 
                  and health care products or even electronic items within minutes.
                </p>
                
                <div className="bg-gradient-to-r from-[#56008F]/5 to-white p-8 border-l-4 border-[#56008F]">
                  <p className="text-lg text-gray-700 italic">
                    For this we are looking for passionate entrepreneurs who want an 
                    opportunity to join the instant-commerce revolution in India. 
                    If this is exciting — partner with us!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Benefits List */}
          <div>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
                Benefits You Get After
                <span className="block font-medium text-[#56008F]">Registering Your Salon</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Grow your salon business with zero hassle and maximum reach
              </p>
            </div>

            <div className="space-y-8">
              {salonBenefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="group bg-white border border-gray-200 hover:border-[#56008F]/40 rounded-lg overflow-hidden transition-all duration-400 hover:shadow-lg"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-5">
                      {/* Number Circle */}
                      <div className="flex-shrink-0 w-14 h-14 bg-[#56008F]/10 rounded-full flex items-center justify-center">
                        <span className="text-[#56008F] text-2xl font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-5">
                          {benefit.title}
                        </h3>
                        
                        <ul className="space-y-3">
                          {benefit.points.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="mt-1.5 w-1.5 h-1.5 bg-[#56008F] rounded-full flex-shrink-0"></span>
                              <span className="text-gray-600 leading-relaxed">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Animated Bottom Bar */}
                  <div className="h-1 bg-gradient-to-r from-[#56008F] to-purple-500 w-0 group-hover:w-full transition-all duration-700"></div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-16 pt-10 border-t border-gray-200">
              <button className="w-full py-5 bg-[#56008F] text-white font-semibold text-xl rounded-lg hover:bg-[#450073] transition-all duration-300 transform hover:scale-105 shadow-lg">
                Register Your Salon Now
              </button>
              <p className="text-center text-gray-500 text-sm mt-4">
                Registration takes less than 5 minutes • Start getting bookings immediately
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdWithUs;