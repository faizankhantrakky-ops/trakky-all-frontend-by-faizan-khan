import React from 'react';
import { Heart, ArrowUpRight } from 'lucide-react';

const PartnerwithusFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Partnership', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trakky</h2>
          <p className="text-gray-600 text-sm">Instant Commerce Platform</p>
        </div>

        {/* Simple Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-gray-600 hover:text-gray-900 text-sm flex items-center"
            >
              {link.name}
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-4 md:mb-0">
            <p>© {currentYear} Trakky Technologies</p>
          </div>
          
          <div className="flex items-center">
            <Heart className="w-3 h-3 mr-1 text-red-500 fill-current" />
            <span>Built for Indian entrepreneurs</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default PartnerwithusFooter;