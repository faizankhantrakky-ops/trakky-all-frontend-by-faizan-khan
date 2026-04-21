import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Star, Shield, Zap, TrendingUp, Clock, Users, MessageCircle } from 'lucide-react';

const FAQSPartnerwith = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const contentRefs = useRef([]);

  const faqs = [
    {
      question: 'Why should I register my salon on this platform?',
      answer: 'Registration boosts your online presence, increases visibility, and drives more bookings. It helps customers find your salon easily, which leads to higher monthly revenue.',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      question: 'Is registration free for salon owners?',
      answer: 'Yes. Registration is completely free with no commission or hidden fees. You get genuine customers at zero risk.',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-green-600 bg-green-50'
    },
    {
      question: 'Do I need technical skills to manage my salon page?',
      answer: 'No. Our dashboard is simple, clean, and beginner-friendly. Anyone can manage bookings and services with ease.',
      icon: <Users className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      question: 'Can customers instantly book appointments?',
      answer: 'Yes. Customers can book in real time. You receive immediate updates and can manage availability easily.',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      question: 'Will this help increase my salon revenue?',
      answer: 'Definitely. More visibility and more bookings directly increase your daily and monthly earnings.',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-red-600 bg-red-50'
    },
    {
      question: 'How long does the verification process take?',
      answer: 'Most salons get verified within 48 hours. Once approved, your profile goes live instantly.',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-indigo-600 bg-indigo-50'
    },
  ];

  const toggleFAQ = (index) => {
    // Smooth closing of currently open FAQ
    if (openIndex !== null && contentRefs.current[openIndex]) {
      contentRefs.current[openIndex].style.transition = 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    // Set new open index (or close if same clicked)
    setOpenIndex(openIndex === index ? null : index);
  };

  // Calculate max height for smooth animation
  const getMaxHeight = (index) => {
    if (openIndex === index) {
      const contentHeight = contentRefs.current[index]?.scrollHeight || 0;
      return contentHeight + 32; // Add padding
    }
    return 0;
  };

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
      <div className="mb-12 md:mb-16">
  <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
    Frequently Asked
    <span className="block font-normal text-[#56008F] mt-2">Questions (FAQs)</span>
  </h2>
  
  <div className="w-24 h-1 bg-gradient-to-r from-[#56008F] via-[#56008F] to-[#56008F] mb-8"></div>
  
  <p className="text-lg text-gray-600 max-w-2xl">
    Find clear answers to the most common questions about our services, 
    partnerships, features, and support. We’ve covered everything you need to know.
  </p>
</div>

        {/* FAQ Grid - One open at a time */}
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`border border-gray-200 rounded-xl transition-all duration-300 overflow-hidden ${
                  openIndex === index 
                    ? ' border-[#56008F]/20' 
                    : 'hover:border-gray-300 '
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left focus:outline-none transition-all duration-300 group"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-content-${index}`}
                >
                  <div className="flex items-center space-x-4 md:space-x-6">
                    <div className={`p-3 rounded-lg ${faq.color} transition-all duration-300 ${
                      openIndex === index ? '' : ''
                    }`}>
                      {faq.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-sm font-medium text-gray-500">Q{index + 1}.</span>
                      </div>
                      
                      <h3 className={`text-lg md:text-xl font-medium transition-all duration-300 ${
                        openIndex === index ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <div className={`p-2 rounded-full transition-all duration-500 ${
                      openIndex === index 
                        ? 'bg-[#56008F] text-white rotate-180' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 rotate-0'
                    }`}>
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5  duration-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5  duration-500" />
                      )}
                    </div>
                  </div>
                </button>
                
                {/* Answer - Smooth height transition */}
                <div 
                  id={`faq-content-${index}`}
                  ref={el => contentRefs.current[index] = el}
                  style={{
                    maxHeight: `${getMaxHeight(index)}px`,
                    transition: 'max-height 500ms, opacity 300ms ease-in-out'
                  }}
                  className={`overflow-hidden transition-all ${
                    openIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
                    <div className="pl-16 md:pl-20">
                      <div className="relative">
                        <div className="absolute -left-3 top-0 w-1 h-full bg-[#56008F]/10 rounded-full"></div>
                        <p className="text-gray-600 leading-relaxed text-lg pl-4">
                          {faq.answer}
                        </p>
                        
                       
                      
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSPartnerwith;