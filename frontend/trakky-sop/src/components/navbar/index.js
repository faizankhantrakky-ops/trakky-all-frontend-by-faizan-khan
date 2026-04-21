"use client"
import { TrakkyLogo } from '@/assets'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import MobileNavbar from '../mobileNavbar'
import Link from 'next/link'
import { NavbarData } from '@/mock/data'
import { 
  Home, IndianRupee, Calendar, Sparkles, Bot, BookOpen, ArrowRight,
  Receipt, Users, UserCheck, CalendarCheck, Package, MessagesSquare,
  ChevronDown, Phone, Mail, MapPin, Instagram, MessageCircle,
  CreditCard, Gift, Ticket, Clock, Monitor, Smartphone, 
  Star, Globe, Shrink, Settings, Scissors, Shirt, Brush
} from 'lucide-react'
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const Navbar = () => {
  const [navbarData] = useState(NavbarData)
  const pathname = usePathname()
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      if (scrollTop > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Disable background scroll when mega menu is open
  useEffect(() => {
    if (isMegaMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMegaMenuOpen])

  const iconMap = { 
    Salon: Home, 
    Features: Sparkles, 
    Pricing: IndianRupee, 
    Blog: BookOpen,
    BarberShop: Scissors
  }

  // Features Mega Menu Data
  const featureGrid = [
    [
      {
        title: "Core POS System",
        features: [
          
          { icon: CreditCard, title: "Smart Discounts" },
          { icon: Package, title: "Service Packages" },
          { icon: Ticket, title: "Membership Plans" },
          { icon: Receipt, title: "Billing - Payments" },
        ]
      },
      {
        title: "Appointment Management",
        features: [
          { icon: CalendarCheck, title: "Appointment Booking" },
          { icon: Users, title: "Customer Tracking" },
          { icon: Globe, title: "Business Website" }
        ]
      },
      {
        title: "Customer Engagement",
        features: [
          { icon: Star, title: "Feedback System" },
          { icon: MessagesSquare, title: "SMS & WhatsApp" },
          { icon: Users, title: "Loyalty Programs" },
        ]
      }
    ],
    [
      {
        title: "Staff Management",
        features: [
          { icon: UserCheck, title: "Staff Profiles" },
          { icon: IndianRupee, title: "Commission Tracking" }
        ]
      },
      {
        title: "Inventory Control",
        features: [
          { icon: Package, title: "Stock Management" },
          { icon: Receipt, title: "Purchase Orders" }
        ]
      },
      {
        title: "Business Analytics",
        features: [
          { icon: Smartphone, title: "Multi-Device Access" },
          { icon: Settings, title: "Performance Reports" },
        ]
      }
    ]
  ]

  // BarberShop Mega Menu Data
  const barberShopGrid = [
    [
      {
        title: "Barber Specific Features",
        features: [
          { icon: Scissors, title: "Haircut Styles Library" },
          { icon: Brush, title: "Beard Styling Tools" },
          { icon: Users, title: "Client Style History" },
          { icon: Clock, title: "Quick Service Timing" }
        ]
      },
      {
        title: "Appointment Management",
        features: [
          { icon: CalendarCheck, title: "Walk-in Management" },
          { icon: Monitor, title: "Barber Queue System" },
          { icon: UserCheck, title: "Barber Availability" },
          { icon: Globe, title: "Online Booking" }
        ]
      },
      {
        title: "Customer Experience",
        features: [
          { icon: Star, title: "Style Ratings & Reviews" },
          { icon: MessagesSquare, title: "Style Reminders" },
          { icon: Users, title: "Loyalty Programs" },
          { icon: Gift, title: "Style Packages" }
        ]
      }
    ],
    [
      {
        title: "Barber Tools",
        features: [
          { icon: Scissors, title: "Service Menu Builder" },
          { icon: Clock, title: "Time Slot Management" },
          { icon: IndianRupee, title: "Service Pricing" }
        ]
      },
      {
        title: "Inventory Management",
        features: [
          { icon: Package, title: "Product Stock Tracking" },
          { icon: Shirt, title: "Merchandise Management" },
          { icon: Receipt, title: "Product Sales" }
        ]
      },
      {
        title: "Business Growth",
        features: [
          { icon: Smartphone, title: "Mobile Barber App" },
          { icon: Settings, title: "Performance Analytics" },
          { icon: MessagesSquare, title: "Client Retention" }
        ]
      }
    ]
  ]

  const handleMegaMenuOpen = (menuType) => {
    setActiveMegaMenu(menuType)
    setIsMegaMenuOpen(true)
  }

  const handleMegaMenuClose = () => {
    setIsMegaMenuOpen(false)
    setActiveMegaMenu(null)
  }

  const renderMegaMenu = () => {
    if (!isMegaMenuOpen) return null

    const currentGrid = activeMegaMenu === 'barbershop' ? barberShopGrid : featureGrid
    const title = activeMegaMenu === 'barbershop' ? 'Complete BarberShop Management' : 'Complete Salon Management Platform'
    const description = activeMegaMenu === 'barbershop' ? 'Everything you need to streamline your barbershop operations' : 'Everything you need to streamline your salon operations'

    return (
      <>
        {/* Background Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-30"
          onClick={handleMegaMenuClose}
        />

        {/* Professional Mega Menu */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-0 z-40 bg-white shadow-2xl"
          style={{ top: isScrolled ? '0' : '96px', height: '70vh' }}
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={handleMegaMenuClose}
        >
          <div className="h-full flex flex-col w-full max-w-[1280px] mx-auto">
            {/* Header Section */}
            <div className="px-12 pt-8 pb-6 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-lg text-gray-600">
                {description}
              </p>
            </div>

            {/* Main Content - Scrollable */}
            <div 
              className="flex-1 overflow-y-auto px-12 py-6"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              {/* Main Grid - 2 Rows x 3 Columns */}
              <div className="space-y-8">
                {/* Row 1 */}
                <div className="grid grid-cols-3 gap-8">
                  {currentGrid[0].map((column, columnIndex) => (
                    <div key={columnIndex} className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-[#7557D4] pl-3 py-1">
                        {column.title}
                      </h3>
                      <div className="space-y-3">
                       {column.features.map((feature, featureIndex) => {
  const slug = feature.title
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <Link
      key={featureIndex}
      href={`/features/${slug}`}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all group"
      onClick={handleMegaMenuClose}
    >
      <div className="w-8 h-8 bg-[#7557D4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <feature.icon className="w-4 h-4 text-[#7557D4]" />
      </div>

      <span className="text-sm font-medium text-gray-700 group-hover:text-[#7557D4] transition-colors">
        {feature.title}
      </span>
    </Link>
  );
})}

                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-3 gap-8">
                  {currentGrid[1].map((column, columnIndex) => (
                    <div key={columnIndex} className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-[#7557D4] pl-3 py-1">
                        {column.title}
                      </h3>
                      <div className="space-y-3">
                       {column.features.map((feature, featureIndex) => {
  const slug = feature.title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-"); // convert title → slug

  return (
    <Link
      key={featureIndex}
      href={`/features/${slug}`}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all group"
      onClick={handleMegaMenuClose}
    >
      <div className="w-8 h-8 bg-[#7557D4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <feature.icon className="w-4 h-4 text-[#7557D4]" />
      </div>

      <span className="text-sm font-medium text-gray-700 group-hover:text-[#7557D4] transition-colors">
        {feature.title}
      </span>
    </Link>
  );
})}

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )
  }

  return (
    <>
      <div className='w-full z-50 relative hidden xl:flex justify-center'>
        <motion.div 
          className={`fixed top-0 left-0 right-0 flex justify-center pointer-events-none transition-all duration-300 ${
            isScrolled ? 'bg-white shadow-lg' : ''
          }`}
          animate={{ 
            top: isScrolled ? 0 : 24,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Main Navbar Container - Full width when scrolled */}
          <div className={`w-full transition-all duration-300 ${
            isScrolled ? 'px-0' : 'max-w-[1280px] px-6'
          } pointer-events-auto`}>
            <div className={`h-[72px] flex justify-between items-center px-8 transition-all duration-300 ${
              isScrolled 
                ? 'bg-[#7557D4] rounded-none border-x-0 border-t-0' 
                : 'bg-[#7557D4] rounded-xl border border-white/20'
            }`}>
              
              <Link href="/" className="flex items-center">
                <Image 
                  src={TrakkyLogo} 
                  width={90} 
                  height={90} 
                  alt="Trakky" 
                  className="hover:opacity-90 transition-opacity"
                />
              </Link>

              <nav className="flex gap-12 text-white font-medium text-[15px]">
                {navbarData.map((item, idx) => {
                  const isActive = pathname === item.url
                  const Icon = iconMap[item.title]

                  return item.hasMegaMenu ? (
                    <div
                      key={idx}
                      className="relative"
                      onMouseEnter={() => handleMegaMenuOpen(item.megaMenuType)}
                    >
                      <div className="flex items-center gap-2 cursor-pointer py-2 group">
                        <Icon className="w-4 h-4 transition-colors" />
                        <span className={`transition-colors ${isMegaMenuOpen && activeMegaMenu === item.megaMenuType ? 'text-white' : 'text-white/90'} group-hover:text-white`}>
                          {item.title}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isMegaMenuOpen && activeMegaMenu === item.megaMenuType ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  ) : (
                    <Link 
                      key={idx} 
                      href={item.url} 
                      className="flex items-center gap-2 py-2 group"
                    >
                      <Icon className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                      <span className="text-white/90 hover:text-white transition-colors">
                        {item.title}
                      </span>
                    </Link>
                  )
                })}
              </nav>

              <div className="flex items-center gap-4">
                <Link href="/ai-receptionist">
                  <button className="px-6 py-2.5 rounded-lg border border-white/30 text-white font-semibold text-sm flex items-center gap-2 hover:bg-white/10 transition-all duration-200">
                    <Bot className="w-4 h-4" /> AI Receptionist
                  </button>
                </Link>
                <Link href="/schedule-demo">
                  <button className="px-7 py-2.5 rounded-lg bg-white text-[#7557D4] font-bold text-sm shadow-lg hover:shadow-xl flex items-center gap-2 hover:bg-gray-50 transition-all duration-200">
                    <Calendar className="w-4 h-4" /> Book Demo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {renderMegaMenu()}
        </AnimatePresence>
      </div>

      <MobileNavbar navbarData={navbarData} /> 
    </>
  )
}

export default Navbar