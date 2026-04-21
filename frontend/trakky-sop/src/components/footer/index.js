import React from 'react';
import Image from 'next/image';
import { TrakkyLogo2, TrakkyLogo } from "@/assets";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Link columns data (unchanged)
  const linkSections = [
    {
      title: "Customers",
      links: [
        { name: "Login", href: "/login" },
        { name: "Help Center", href: "/help" },
        { name: "Refer A Business", href: "/refer" },
        { name: "System Status", href: "/status" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Press", href: "/press" },
        { name: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "Success Stories", href: "/success" },
        { name: "Case Studies", href: "/case-studies" },
        { name: "Community", href: "/community" },
        { name: "Events", href: "/events" },
        { name: "Book Demo", href: "/demo" }
      ]
    },
    {
      title: "Why Trakky?",
      links: [
        { name: "#1 Business Platform", href: "/why#platform" },
        { name: "Why Switch", href: "/why#switch" },
        { name: "AI-Powered Features", href: "/why#ai" },
        { name: "24/7 Support", href: "/why#support" },
        { name: "Proven ROI", href: "/why#roi" },
        { name: "Industry Reports", href: "/why#reports" }
      ]
    }
  ];

  // Feature sections (unchanged)
  const featureSections = [
    {
      title: "Core POS System",
      features: [
        { name: "Billing & Payments", href: "/features/billing" },
        { name: "Smart Discounts", href: "/features/discounts" },
        { name: "Service Packages", href: "/features/packages" },
        { name: "Membership Plans", href: "/features/membership" }
      ]
    },
    {
      title: "Appointment Management",
      features: [
        { name: "Appointment Booking", href: "/features/booking" },
        { name: "Customer Tracking", href: "/features/tracking" },
        { name: "Business Website", href: "/features/website" }
      ]
    },
    {
      title: "Customer Engagement",
      features: [
        { name: "Feedback System", href: "/features/feedback" },
        { name: "SMS & WhatsApp", href: "/features/messaging" },
        { name: "Loyalty Programs", href: "/features/loyalty" }
      ]
    },
    {
      title: "Staff Management",
      features: [
        { name: "Staff Profiles", href: "/features/staff" },
        { name: "Commission Tracking", href: "/features/commission" }
      ]
    },
    {
      title: "Inventory Control",
      features: [
        { name: "Stock Management", href: "/features/stock" },
        { name: "Purchase Orders", href: "/features/orders" }
      ]
    },
    {
      title: "Business Analytics",
      features: [
        { name: "Multi-Device Access", href: "/features/multi-device" },
        { name: "Performance Reports", href: "/features/reports" }
      ]
    }
  ];

  // Social links – including WhatsApp
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/trakky",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      href: "https://instagram.com/trakky",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="currentColor"/>
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/trakky",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      )
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/916355167304?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20your%20Salon%20Management%20Software.%20Can%20you%20please%20share%20pricing%20and%20demo%20details?",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      )
    }
  ];

  // Legal links (unchanged)
  const legalLinks = [
    { name: "Terms of Use", href: "/terms" },
    { name: "Privacy Notice", href: "/privacy" },
    { name: "Cookie Notice", href: "/cookies" },
    { name: "Trust Center", href: "/trust" }
  ];

  return (
    <>
      <footer className="bg-gradient-to-b from-[#7557D4] to-[#5A3FA3] text-white rounded-t-[40px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Link Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {linkSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-md mb-6 text-white">{section.title}</h3>
                <ul className="space-y-1">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href={link.href}
                        className="text-gray-100 hover:text-white transition-colors text-sm block py-1"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 my-10"></div>

          {/* Features Section */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-8 lg:text-left border-l-4 border-white pl-2">
              Our Features
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {featureSections.map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-sm mb-4 text-white opacity-90">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.features.map((feature, featureIdx) => (
                      <li key={featureIdx}>
                        <a
                          href={feature.href}
                          className="text-gray-200 hover:text-white transition-colors text-xs block"
                        >
                          {feature.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/20 my-6"></div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <Image
                src={TrakkyLogo}
                alt="Trakky Logo"
                width={120}
                height={80}
                className="rounded-md"
              />
            </div>

            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-300 rounded-lg p-2 hover:bg-white/10 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-gray-200">
              <span>© {currentYear} Trakky. All rights reserved.</span>
              <div className="flex flex-wrap gap-4">
                {legalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/916355167304?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20your%20Salon%20Management%20Software.%20Can%20you%20please%20share%20pricing%20and%20demo%20details?"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20b858] transition-colors duration-300 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </a>
    </>
  );
};

export default Footer;