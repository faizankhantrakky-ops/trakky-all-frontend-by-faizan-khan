"use client";
import React, { useEffect, useState } from "react";
import { TrakkyLogo2, TrakkyLogo } from "@/assets";
import Image from "next/image";
import {
  Menu,
  X,
  Home,
  IndianRupee,
  BookOpen,
  LogIn,
  Calendar,
  Sparkles,
  Scissors,
  ChevronDown,
  Receipt,
  Users,
  UserCheck,
  CalendarCheck,
  Package,
  MessagesSquare,
  CreditCard,
  Gift,
  Ticket,
  Clock,
  Monitor,
  Smartphone,
  Star,
  Globe,
  Settings,
  Brush,
  Shirt,
  Bot,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const MobileNavbar = ({ navbarData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
    setOpenSubMenu(null);
  }, [pathname]);

  const iconMap = {
    Salon: Home,
    Features: Sparkles,
    Pricing: IndianRupee,
    Blog: BookOpen,
    BarberShop: Scissors,
  };

  // Features Mega Menu Data for Mobile
  const featureGridMobile = [
    {
      title: "Core POS System",
      features: [
        { icon: Receipt, title: "Billing & Payments" },
        { icon: CreditCard, title: "Smart Discounts" },
        { icon: Package, title: "Service Packages" },
        { icon: Ticket, title: "Membership Plans" },
      ],
    },
    {
      title: "Appointment Management",
      features: [
        { icon: CalendarCheck, title: "Appointment Booking" },
        { icon: Users, title: "Customer Tracking" },
        { icon: Globe, title: "Business Website" },
      ],
    },
    {
      title: "Customer Engagement",
      features: [
        { icon: Star, title: "Feedback System" },
        { icon: MessagesSquare, title: "SMS & WhatsApp" },
        { icon: Users, title: "Loyalty Programs" },
      ],
    },
    {
      title: "Staff Management",
      features: [
        { icon: UserCheck, title: "Staff Profiles" },
        { icon: IndianRupee, title: "Commission Tracking" },
      ],
    },
    {
      title: "Inventory Control",
      features: [
        { icon: Package, title: "Stock Management" },
        { icon: Receipt, title: "Purchase Orders" },
      ],
    },
    {
      title: "Business Analytics",
      features: [
        { icon: Smartphone, title: "Multi-Device Access" },
        { icon: Settings, title: "Performance Reports" },
      ],
    },
  ];

  // BarberShop Mega Menu Data for Mobile
  const barberShopGridMobile = [
    {
      title: "Barber Specific Features",
      features: [
        { icon: Scissors, title: "Haircut Styles Library" },
        { icon: Brush, title: "Beard Styling Tools" },
        { icon: Users, title: "Client Style History" },
        { icon: Clock, title: "Quick Service Timing" },
      ],
    },
    {
      title: "Appointment Management",
      features: [
        { icon: CalendarCheck, title: "Walk-in Management" },
        { icon: Monitor, title: "Barber Queue System" },
        { icon: UserCheck, title: "Barber Availability" },
        { icon: Globe, title: "Online Booking" },
      ],
    },
    {
      title: "Customer Experience",
      features: [
        { icon: Star, title: "Style Ratings & Reviews" },
        { icon: MessagesSquare, title: "Style Reminders" },
        { icon: Users, title: "Loyalty Programs" },
        { icon: Gift, title: "Style Packages" },
      ],
    },
    {
      title: "Barber Tools",
      features: [
        { icon: Scissors, title: "Service Menu Builder" },
        { icon: Clock, title: "Time Slot Management" },
        { icon: IndianRupee, title: "Service Pricing" },
      ],
    },
    {
      title: "Inventory Management",
      features: [
        { icon: Package, title: "Product Stock Tracking" },
        { icon: Shirt, title: "Merchandise Management" },
        { icon: Receipt, title: "Product Sales" },
      ],
    },
    {
      title: "Business Growth",
      features: [
        { icon: Smartphone, title: "Mobile Barber App" },
        { icon: Settings, title: "Performance Analytics" },
        { icon: MessagesSquare, title: "Client Retention" },
      ],
    },
  ];

  const toggleSubMenu = (menuType) => {
    setOpenSubMenu(openSubMenu === menuType ? null : menuType);
  };

  const renderSubMenu = (menuType) => {
    const currentGrid =
      menuType === "barbershop" ? barberShopGridMobile : featureGridMobile;
    const title =
      menuType === "barbershop" ? "BarberShop Features" : "Salon Features";

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pl-4 pr-2 py-3 bg-gray-50 rounded-lg mt-2">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#4530A8] mb-2">{title}</h3>
            <p className="text-sm text-gray-600">
              {menuType === "barbershop"
                ? "Everything you need to streamline your barbershop operations"
                : "Everything you need to streamline your salon operations"}
            </p>
          </div>

          {/* Hidden scrollbar but scrollable */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
            {currentGrid.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="border-l-2 border-[#7557D4] pl-3"
              >
                <h4 className="font-semibold text-gray-900 text-sm mb-2">
                  {section.title}
                </h4>
                <div className="space-y-2">
                  {section.features.map((feature, featureIndex) => {
  const slug = feature.title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  return (
    <Link
      key={featureIndex}
      href={`/features/${slug}`}
      onClick={() => setMenuOpen(false)}
    >
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-all group">
        <div className="w-6 h-6 bg-[#7557D4]/10 rounded flex items-center justify-center flex-shrink-0">
          <feature.icon className="w-3 h-3 text-[#7557D4]" />
        </div>
        <span className="text-xs font-medium text-gray-700 group-hover:text-[#7557D4] transition-colors">
          {feature.title}
        </span>
      </div>
    </Link>
  );
})}

                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Top Fixed Bar */}
      <div className="w-full px-3 flex justify-center items-center fixed z-[60] xl:hidden">
        <div className="w-full relative flex h-[64px] mt-[20px] justify-between items-center px-4 py-2 bg-[#7557D4] shadow-lg rounded-lg border border-white/10 backdrop-blur-md bg-opacity-95">
          <Link href={"/"}>
            <div className="flex items-center">
              <Image
                src={TrakkyLogo}
                width={70}
                height={70}
                alt="Trakky Logo"
                className="transition-opacity duration-300 hover:opacity-90"
              />
            </div>
          </Link>
          <button
            className="flex justify-center items-center p-1 rounded-lg hover:bg-white/10 transition-all duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="text-white w-5 h-5 transition-transform duration-300 rotate-180" />
            ) : (
              <Menu className="text-white w-5 h-5 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white shadow-xl z-[60] p-5 flex flex-col gap-5 border-l border-gray-200/20 backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <Link href={"/"} onClick={() => setMenuOpen(false)}>
                  <Image src={TrakkyLogo2} width={90} height={90} alt="Trakky Logo" />
                </Link>
                <button
                  className="p-1 rounded-lg hover:bg-gray-100/50 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <X className="text-[#4530A8] w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content - Hide Scrollbar */}
              <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
                <div className="flex flex-col gap-3 text-[#4530A8] font-medium text-base tracking-tight">
                  {navbarData.map((item, idx) => {
                    const isActive = pathname === item?.url;
                    const Icon = iconMap[item.title];

                    if (item.hasMegaMenu) {
                      return (
                        <div key={idx} className="pb-2">
                          <button
                            onClick={() => toggleSubMenu(item.megaMenuType)}
                            className={`w-full cursor-pointer py-3 px-3 rounded-lg transition-all duration-300 flex items-center justify-between ${
                              isActive
                                ? "bg-[#4530A8]/10 text-[#4530A8]"
                                : "hover:bg-[#4530A8]/5 hover:text-[#6B4EDB]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon
                                className={`w-4 h-4 ${
                                  isActive ? "text-[#4530A8]" : "text-[#6B4EDB]"
                                }`}
                              />
                              {item?.title}
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${
                                openSubMenu === item.megaMenuType ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {openSubMenu === item.megaMenuType && renderSubMenu(item.megaMenuType)}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    return (
                      <Link href={item?.url} key={idx} onClick={() => setMenuOpen(false)}>
                        <p
                          className={`cursor-pointer py-3 px-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                            isActive
                              ? "bg-[#4530A8]/10 text-[#4530A8]"
                              : "hover:bg-[#4530A8]/5 hover:text-[#6B4EDB]"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? "text-[#4530A8]" : "text-[#6B4EDB]"
                            }`}
                          />
                          {item?.title}
                        </p>
                      </Link>
                    );
                  })}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-gray-200/20">
                  <Link href={"/ai-receptionist"} onClick={() => setMenuOpen(false)}>
                    <button className="w-full px-4 py-2.5 rounded-lg border border-[#4530A8] text-[#4530A8] font-medium text-base tracking-tight flex items-center gap-2 hover:bg-[#4530A8] hover:text-white transition-all duration-300">
                      <Bot className="w-4 h-4" />
                      AI Receptionist
                    </button>
                  </Link>

                  {/* <Link href={"/login"} onClick={() => setMenuOpen(false)}>
                    <button className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-base tracking-tight flex items-center gap-2 hover:bg-gray-50 transition-all duration-300">
                      <LogIn className="w-4 h-4" />
                      Login
                    </button>
                  </Link> */}

                  <Link href={"/schedule-demo"} onClick={() => setMenuOpen(false)}>
                    <button className="w-full px-4 py-2.5 rounded-lg bg-[#4530A8] text-white font-semibold text-base tracking-tight shadow-md flex items-center gap-2 hover:bg-[#3B2390] transition-all duration-300">
                      <Calendar className="w-4 h-4" />
                      Book a Demo
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tailwind utility to hide scrollbar (add this once in your globals or _app.js if not already) */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </>
  );
};

export default MobileNavbar;