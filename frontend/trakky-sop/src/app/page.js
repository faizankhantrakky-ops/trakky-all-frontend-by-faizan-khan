import {
  CTAComponent,
  FeaturesPOS,
  HeroSection,
  HowItWorksSection,
  OurPartner,
  Testimonial,
} from "@/components";
import React from "react";
import Head from "next/head";
import Slider_OurSaloon from "@/components/slider_OurSaloon/Slider_OurSaloon";

// ---------------------------------------

export const metadata = {
  title: "Trakky | India’s Best Salon Management Software",
  description:
    "Trakky is India’s #1 salon management software. Manage appointments, staff, billing & clients with ease. Trusted by top salons across India.",
  alternates: {
    canonical: "https://salonmanagementsoftware.trakky.in/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Home = () => {
  return (
    <>
      {/* ✅ Add custom SEO tags manually */}
      <Head>
        <meta
          name="keywords"
          content="best salon management software, salon software india, salon booking software, salon billing software, salon booking system, salon booking apps"
        />
        <meta name="publisher" content="Trakky" />
        <meta httpEquiv="X-Robots-Tag" content="index, follow" />
        <meta name="language" content="en" />
      </Head>

      {/* ✅ Page Content */}
      <HeroSection />
        <Slider_OurSaloon/>
      <FeaturesPOS />
      <HowItWorksSection />
      {/* <OurPartner /> */}
      
      <CTAComponent />
    
      <Testimonial />
    </>
  );
};

export default Home;
