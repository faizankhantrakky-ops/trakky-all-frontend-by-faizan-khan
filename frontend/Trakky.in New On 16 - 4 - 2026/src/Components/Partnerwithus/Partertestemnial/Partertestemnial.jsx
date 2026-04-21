import React, { useRef, useState } from 'react';

const PartnerTestimonial = () => {
const testimonials = [
  {
    id: 1,
    name: "Amit Shah",
    position: "Founder, Smart Look Salon",
    location: "Vastrapur, Ahmedabad",
    quote: "After joining Trakky, our daily bookings increased and customer management became completely digital.",
    rating: 5,
    imageInitial: "AS",
    partnershipDuration: "Partner since 2020",
    highlight: "2x Daily Bookings"
  },
  {
    id: 2,
    name: "Priya Patel",
    position: "Owner, Glow Beauty Studio",
    location: "Navrangpura, Ahmedabad",
    quote: "Trakky's booking system and customer management tools saved us a lot of time and improved our service quality.",
    rating: 5,
    imageInitial: "PP",
    partnershipDuration: "Partner since 2021",
    highlight: "45% Faster Operations"
  },
  {
    id: 3,
    name: "Rahul Mehta",
    position: "Director, Urban Style Salon",
    location: "Satellite, Ahmedabad",
    quote: "With Trakky, our online bookings and repeat customers increased drastically within the first year.",
    rating: 5,
    imageInitial: "RM",
    partnershipDuration: "Partner since 2023",
    highlight: "90% Client Retention"
  },
  {
    id: 4,
    name: "Neha Shah",
    position: "Managing Partner, Aura Unisex Salon",
    location: "Bodakdev, Ahmedabad",
    quote: "The business analytics feature helped us understand our daily income, peak hours, and staff performance clearly.",
    rating: 5,
    imageInitial: "NS",
    partnershipDuration: "Partner since 2020",
    highlight: "3x Business Growth"
  },
  {
    id: 5,
    name: "Imran Pathan",
    position: "Owner, Style Hub Grooming",
    location: "Maninagar, Ahmedabad",
    quote: "The onboarding and staff training by the Trakky team was smooth and very professional.",
    rating: 5,
    imageInitial: "IP",
    partnershipDuration: "Partner since 2022",
    highlight: "Easy Setup & Training"
  },
  {
    id: 6,
    name: "Kajal Joshi",
    position: "Founder, Elegance Beauty Lounge",
    location: "Gota, Ahmedabad",
    quote: "Today we manage multiple staff, services, and customer data digitally only because of Trakky.",
    rating: 5,
    imageInitial: "KJ",
    partnershipDuration: "Partner since 2021",
    highlight: "Multi-Branch Ready"
  },
  {
    id: 7,
    name: "Suresh Patel",
    position: "Owner, Patel Hair Studio",
    location: "Chandkheda, Ahmedabad",
    quote: "Trakky helped us reduce walk-in waiting time and increased customer satisfaction.",
    rating: 5,
    imageInitial: "SP",
    partnershipDuration: "Partner since 2022",
    highlight: "High Customer Satisfaction"
  },
  {
    id: 8,
    name: "Ritika Desai",
    position: "Co-Founder, Blossom Beauty Care",
    location: "Thaltej, Ahmedabad",
    quote: "Our social media promotions and online bookings improved massively after partnering with Trakky.",
    rating: 5,
    imageInitial: "RD",
    partnershipDuration: "Partner since 2023",
    highlight: "Strong Online Presence"
  },
  {
    id: 9,
    name: "Mohit Verma",
    position: "Owner, Trendz Grooming Lounge",
    location: "Bapunagar, Ahmedabad",
    quote: "Real-time reports and income tracking helped me control my daily operations better.",
    rating: 5,
    imageInitial: "MV",
    partnershipDuration: "Partner since 2021",
    highlight: "Accurate Daily Reports"
  },
  {
    id: 10,
    name: "Farida Shaikh",
    position: "Founder, Queen's Beauty Salon",
    location: "Juhapura, Ahmedabad",
    quote: "Because of Trakky, we now receive regular online bookings and repeat customers every week.",
    rating: 5,
    imageInitial: "FS",
    partnershipDuration: "Partner since 2022",
    highlight: "Consistent Online Bookings"
  }
];

  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
      setCurrentIndex(Math.min(testimonials.length - 3, currentIndex + 1));
    }
  };

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="pt-8">
          {/* Header Section with Navigation Arrows */}
          <div className="mb-20 flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                Trusted by Industry
                <span className="block font-normal text-[#56008F] mt-2">Leaders IndiaWide</span>
              </h2>
              
              <div className="w-24 h-1 bg-gradient-to-r from-[#56008F] via-[#56008F] to-[#56008F] mb-8"></div>
              
              <p className="text-lg text-gray-600 max-w-2xl">
                Hear from our esteemed partners who have transformed their salon businesses 
                through strategic partnership with Trakky.
              </p>
            </div>

            {/* Navigation Arrows - Positioned top-right */}
            <div className="flex space-x-4 ml-8">
              <button 
                onClick={scrollLeft}
                disabled={currentIndex === 0}
                className={`w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300 ${
                  currentIndex === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-[#56008F] hover:bg-[#56008F]/5'
                }`}
              >
                <svg 
                  className={`w-6 h-6 ${currentIndex === 0 ? 'text-gray-400' : 'text-gray-600'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={scrollRight}
                disabled={currentIndex >= testimonials.length - 3}
                className={`w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300 ${
                  currentIndex >= testimonials.length - 3
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-[#56008F] hover:bg-[#56008F]/5'
                }`}
              >
                <svg 
                  className={`w-6 h-6 ${currentIndex >= testimonials.length - 3 ? 'text-gray-400' : 'text-gray-600'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Testimonials Horizontal Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-hidden gap-8 mb-4 scroll-smooth pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="group bg-white border border-gray-200 hover:border-[#56008F]/30 transition-all duration-300 hover:shadow-lg flex-shrink-0 w-full md:w-[calc(33.333%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] min-w-[300px]"
              >
                {/* Testimonial Card */}
                <div className="p-8 h-full flex flex-col">
                  
                  {/* Rating */}
                  <div className="mb-6">
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-500 ml-2">Perfect Score</span>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="mb-8 flex-grow">
                    <p className="text-gray-600 leading-relaxed italic">
                      {testimonial.quote}
                    </p>
                  </div>

                  {/* Partner Info */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#56008F]/20 to-[#56008F]/5 flex items-center justify-center">
                          <span className="text-[#56008F] text-lg font-bold">
                            {testimonial.imageInitial}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {testimonial.location}
                      </div>
                      <span className="text-[#56008F] text-xs font-medium px-3 py-1 bg-[#56008F]/10 rounded-full">
                        {testimonial.partnershipDuration}
                      </span>
                    </div>
                  </div>

                  {/* Highlight Badge */}
                
                </div>

                {/* Hover Accent */}
                <div className="w-0 h-1 bg-gradient-to-r from-[#56008F] to-purple-400 group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>

          {/* Dots Indicator (Optional) */}
          <div className="flex justify-center space-x-2">
            {[...Array(testimonials.length - 2)].map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      left: index * 400,
                      behavior: 'smooth'
                    });
                    setCurrentIndex(index);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-[#56008F] w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerTestimonial;