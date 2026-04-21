import React from "react";
import {
  TrendingUp,
  Shield,
  Calendar,
  CheckCircle,
  FileText,
  Upload,
  Eye,
  Users,
  Clock,
  Star,
  ArrowRight,
  Award,
  Sparkles,
} from "lucide-react";

const SalonPlatformBenefits = () => {
  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Designed to Accelerate Salon Growth",
      description:
        "Whether you run a beauty salon, men's grooming studio, nail studio, or unisex salon, our platform helps you get more customers and manage your business more efficiently.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "No Hidden Fees Ever",
      points: [
        "Zero commission",
        "Zero registration charges",
        "No extra cost for your first set of customers",
      ],
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Appointment Booking System",
      points: [
        "Organises your schedule automatically",
        "Prevents double bookings",
        "Reduces peak-hour confusion and cancellations",
      ],
    },
  ];

  const registrationSteps = [
    {
      step: "1",
      title: "Enter Your Salon Details",
      description:
        "Add your salon name, address, contact number & service categories.",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      step: "2",
      title: "Upload Photos & Service Menu",
      description:
        "Showcase your ambience, work quality, and pricing to attract more customers.",
      icon: <Upload className="w-5 h-5" />,
    },
    {
      step: "3",
      title: "Get Verified & Go Live",
      description:
        "Once verified, your salon becomes instantly visible to thousands of active customers searching near you.",
      icon: <Eye className="w-5 h-5" />,
    },
  ];

  const benefits = [
    "Reduces front-desk workload",
    "Fills empty time slots",
    "Attracts high-intent customers",
    "Strengthens your brand reputation",
    "Increases monthly revenue consistently",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}

        <div>
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-8">
            What Makes Our Platform Perfect
            <span className="block text-[#56008F] mt-2">for Salon Owners?</span>
          </h2>
          <div className="w-24 h-1 bg-[#56008F] mb-10"></div>
          <p className="text-gray-600 max-w-2xl mb-4">
            Everything you need to grow your salon business efficiently
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="h-full p-8 border border-gray-200 rounded-lg hover:border-[#56008F] transition-colors duration-300">
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-[#56008F] rounded-lg flex items-center justify-center mb-6">
                      <div className="text-white">{feature.icon}</div>
                    </div>

                    <h3 className="text-xl  text-gray-900 mb-4">
                      {feature.title}
                    </h3>

                    {feature.description && (
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    )}

                    {feature.points && (
                      <ul className="mt-4 space-y-3">
                        {feature.points.map((point, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-[#56008F] mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Process */}
        <div className="mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl text-gray-900 mb-6 leading-tight">
              Effortless Setup in
              <span className="block text-[#56008F] mt-2 font-medium">
                Just Three Simple Steps
              </span>
            </h2>

            <div className="w-24 h-1 bg-[#56008F] mb-8"></div>

            <p className="text-gray-600 max-w-4xl mb-12 text-lg">
              Get your salon fully operational within minutes — no technical
              knowledge required.
            </p>
          </div>

          <div className="relative">
            {/* Timeline for desktop */}
            <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-2/3 h-px bg-gray-200"></div>

            <div className="grid md:grid-cols-3 gap-12 lg:gap-8">
              {registrationSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div
                    className="bg-white rounded-xl p-10 text-center h-full 
                      border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Step Number Badge */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div
                        className="w-12 h-12 bg-[#56008F] rounded-full flex items-center justify-center 
                          text-white font-medium text-base border-4 border-white shadow-md"
                      >
                        {step.step}
                      </div>
                    </div>

                    {/* Icon Section */}
                    <div className="mb-8">
                      <div
                        className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center 
                          mx-auto mb-8 border border-gray-100"
                      >
                        <div className="text-2xl text-[#56008F]">
                          {step.icon}
                        </div>
                      </div>

                      {/* Title with subtle underline */}
                      <h3
                        className="text-2xl font-normal text-gray-900 mb-5 pb-4 
                         relative after:absolute after:bottom-0 after:left-1/2 
                         after:transform after:-translate-x-1/2 after:w-12 
                         after:h-px after:bg-gray-300"
                      >
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed text-base">
                        {step.description}
                      </p>
                    </div>

                    {/* Subtle indicator */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">
                        Step {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Connector for mobile */}
                  {index < registrationSteps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-10 mb-2">
                      <div className="w-6 h-6 text-gray-300">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits & CTA Section */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Column - Benefits */}
          <div className="bg-white rounded-xl p-10 border border-gray-100">
            <div className="mb-12">
              <div className="flex items-center mb-8 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-[#56008F]/10 rounded-lg flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-[#56008F]" />
                </div>
                <div>
                  <h2 className="text-2xl  text-gray-900  mb-1">
                    Trusted by Salon Professionals
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">
                    Industry-approved features designed for success
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="w-8 h-8 bg-[#56008F]/5 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-[#56008F]" />
                    </div>
                    <div>
                      <p className="text-gray-800 leading-relaxed">{benefit}</p>
                      {index < benefits.length - 1 && (
                        <div className="w-20 h-px bg-gray-100 mt-6"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center"></div>
                <div className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  Industry Standard
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - CTA */}
          <div className="bg-white rounded-xl p-10 border border-gray-100">
            <div className="mb-12">
              <div className="flex items-center mb-8 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-[#56008F]/10 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-[#56008F]" />
                </div>
                <div>
                  <h2 className="text-2xl  text-gray-900  mb-1">
                    Launch Your Digital Presence
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">
                    Register in minutes, grow for years
                  </p>
                </div>
              </div>

              <div className="mb-10">
                <p className="text-gray-700 text-lg leading-relaxed mb-10">
                  Join hundreds of established salons expanding their reach
                  through our platform. A streamlined registration process
                  provides immediate access to growth opportunities.
                </p>

                <div className="space-y-8">
                  <div className="pl-6 border-l-2 border-[#56008F]/20">
                    <h3 className="text-gray-900 font-normal text-lg mb-3">
                      Enhanced Business Visibility
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Present your salon to an expansive client network
                    </p>
                  </div>

                  <div className="pl-6 border-l-2 border-[#56008F]/20">
                    <h3 className="text-gray-900 font-normal text-lg mb-3">
                      Optimized Appointment Scheduling
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Maximize utilization and increase revenue potential
                    </p>
                  </div>

                  <div className="pl-6 border-l-2 border-[#56008F]/20">
                    <h3 className="text-gray-900 font-normal text-lg mb-3">
                      Sustainable Business Growth
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Leverage scalable solutions for long-term success
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-100">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 font-normal text-lg">
                    Secure Your Salon's Future
                  </h3>
                  <span className="text-sm font-medium text-[#56008F] bg-[#56008F]/5 px-3 py-1 rounded-full">
                    Limited Availability
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-8">
                  Registration positions your business for immediate growth
                  opportunities
                </p>
              </div>

              <button
                className="w-full py-5 bg-[#56008F] text-white font-medium text-base 
                     rounded-xl hover:bg-[#4A0078] transition-colors duration-300 
                     flex items-center justify-center group"
              >
                <span>Begin Registration Process</span>
                <div className="ml-4 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};  

export default SalonPlatformBenefits;
