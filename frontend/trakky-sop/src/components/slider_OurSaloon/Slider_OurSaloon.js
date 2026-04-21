"use client"
import Image from 'next/image';
import React from 'react';

const Slider_OurSaloon = () => {
  // Duplicate the logos array to create seamless infinite effect
  const logos = [
    { src: 'https://i.pinimg.com/736x/01/9f/73/019f736cf619782c03585ee5d496579f.jpg', alt: 'Skin Laundry' },
    { src: 'https://media.istockphoto.com/id/2154345483/vector/beauty-salon-125-pink.jpg?s=612x612&w=0&k=20&c=UpkIGZ6gAYA5RTLp2St4Iy3aF613nQNdkDe7uVeWyzQ=', alt: 'Orange Wheel' },
    { src: 'https://i.pinimg.com/736x/01/9f/73/019f736cf619782c03585ee5d496579f.jpg', alt: 'Synergy Hair' },
    { src: 'https://i.pinimg.com/736x/01/9f/73/019f736cf619782c03585ee5d496579f.jpg', alt: 'Murad' },
    { src: 'https://i.pinimg.com/736x/01/9f/73/019f736cf619782c03585ee5d496579f.jpg', alt: 'Shobha' },
    // Add more logos as needed
  ];

  // Duplicate array for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden py-6">
      <div className="relative">
        {/* Marquee Animation */}
        <div className="flex animate-marquee whitespace-nowrap">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="mx-8 flex items-center justify-center flex-shrink-0"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={180}
                height={80}
                className="object-contain h-[100px] filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>

     
      </div>

      {/* Tailwind Custom Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee2 {
          0% {
            transform: translateX(50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-marquee {
          animation: marquee 8s linear infinite;
        }

        
      `}</style>
    </div>
  );
};

export default Slider_OurSaloon;